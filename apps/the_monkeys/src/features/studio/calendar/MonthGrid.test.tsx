import type { SocialPost } from '@/features/studio/types';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CalendarDayCell from './CalendarDayCell';
import CalendarPostChip from './CalendarPostChip';
import MonthGrid from './MonthGrid';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/hooks/studio/useSocialPosts', () => ({
  useSocialPostMutations: () => ({
    publishNow: { mutateAsync: vi.fn(), isPending: false },
    cancelSchedule: { mutateAsync: vi.fn(), isPending: false },
    deleteDraft: { mutateAsync: vi.fn(), isPending: false },
    schedule: { mutateAsync: vi.fn(), isPending: false },
  }),
}));

const samplePosts: SocialPost[] = [
  {
    id: 'post-1',
    base_text: 'Morning announcement',
    state: 'scheduled',
    status: 'scheduled',
    version: 1,
    scheduled_at: '2026-10-15T09:30:00',
    schedule_timezone: 'UTC',
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
    renditions: [{ platform: 'x', social_account_id: 'acc-1' }],
  },
  {
    id: 'post-2',
    base_text: 'Afternoon insights',
    state: 'scheduled',
    status: 'scheduled',
    version: 1,
    scheduled_at: '2026-10-15T11:30:00',
    schedule_timezone: 'UTC',
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
    renditions: [{ platform: 'linkedin', social_account_id: 'acc-2' }],
  },
  {
    id: 'post-3',
    base_text: 'Evening summary',
    state: 'scheduled',
    status: 'scheduled',
    version: 1,
    scheduled_at: '2026-10-15T14:00:00',
    schedule_timezone: 'UTC',
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
    renditions: [{ platform: 'instagram', social_account_id: 'acc-3' }],
  },
  {
    id: 'post-4',
    base_text: 'Late night drop',
    state: 'scheduled',
    status: 'scheduled',
    version: 1,
    scheduled_at: '2026-10-15T16:30:00',
    schedule_timezone: 'UTC',
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
    renditions: [{ platform: 'facebook', social_account_id: 'acc-4' }],
  },
  {
    id: 'post-5',
    base_text: 'Weekend kickoff',
    state: 'scheduled',
    status: 'scheduled',
    version: 1,
    scheduled_at: '2026-10-17T11:00:00',
    schedule_timezone: 'UTC',
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
    renditions: [{ platform: 'youtube', social_account_id: 'acc-5' }],
  },
];

describe('MonthGrid & Subcomponents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('CalendarPostChip', () => {
    it('renders platform icon, formatted time, and truncated text', () => {
      render(<CalendarPostChip post={samplePosts[0]} />);

      expect(screen.getByText('Morning announcement')).toBeDefined();
      expect(screen.getByText(/9:30 AM/i)).toBeDefined();
      expect(screen.getByTitle(/x/i)).toBeDefined();
    });

    it('navigates to /studio/compose/:id when chip is clicked', () => {
      render(<CalendarPostChip post={samplePosts[0]} />);

      const chip = screen.getByTestId('calendar-post-chip-post-1');
      fireEvent.click(chip);

      expect(mockPush).toHaveBeenCalledWith('/studio/compose/post-1');
    });

    it('renders 3-dot trigger for PostActionsMenu without triggering chip navigation', () => {
      render(<CalendarPostChip post={samplePosts[0]} />);

      const actionsBtn = screen.getByRole('button', { name: /post actions/i });
      expect(actionsBtn).toBeDefined();

      fireEvent.click(actionsBtn);
      // PostActionsMenu dropdown opened
      expect(screen.getByText(/edit in composer/i)).toBeDefined();
      // Should NOT have navigated via chip click
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('CalendarDayCell', () => {
    const targetDate = new Date(2026, 9, 15); // Oct 15, 2026
    const octMonth = new Date(2026, 9, 1);

    it('renders day number header and handles onClick callback', () => {
      const handleClick = vi.fn();
      render(
        <CalendarDayCell
          day={targetDate}
          currentDate={octMonth}
          posts={samplePosts.slice(0, 2)}
          onClick={handleClick}
        />
      );

      expect(screen.getByText('15')).toBeDefined();
      const cell = screen.getByTestId('calendar-day-cell-2026-10-15');
      fireEvent.click(cell);
      expect(handleClick).toHaveBeenCalledWith(targetDate);
    });

    it('dims opacity for days outside current month', () => {
      const sepDay = new Date(2026, 8, 30); // Sep 30, 2026
      render(
        <CalendarDayCell day={sepDay} currentDate={octMonth} posts={[]} />
      );

      const cell = screen.getByTestId('calendar-day-cell-2026-09-30');
      expect(cell.className).toContain('opacity-');
    });

    it('includes a hover + icon button linking to /studio/compose?date=YYYY-MM-DD', () => {
      render(
        <CalendarDayCell day={targetDate} currentDate={octMonth} posts={[]} />
      );

      const addBtn = screen.getByRole('link', {
        name: /schedule post on 2026-10-15/i,
      });
      expect(addBtn.getAttribute('href')).toBe(
        '/studio/compose?date=2026-10-15'
      );
    });

    it('renders up to 3 chips and shows +N more pill when day has > 3 posts', () => {
      const dayPosts = samplePosts.slice(0, 4); // 4 posts on Oct 15
      render(
        <CalendarDayCell
          day={targetDate}
          currentDate={octMonth}
          posts={dayPosts}
        />
      );

      expect(screen.getByText('Morning announcement')).toBeDefined();
      expect(screen.getByText('Afternoon insights')).toBeDefined();
      expect(screen.getByText('Evening summary')).toBeDefined();
      expect(screen.queryByText('Late night drop')).toBeNull();

      expect(screen.getByText('+1 more')).toBeDefined();
    });
  });

  describe('MonthGrid', () => {
    it('generates 35 day cells for October 2026 and 42 day cells for August 2026 in desktop view', () => {
      const { rerender } = render(
        <MonthGrid currentDate={new Date(2026, 9, 1)} posts={[]} />
      );

      // October 2026 desktop grid: Mon Sep 28 to Sun Nov 1 = 35 cells
      const octCells = screen.getAllByTestId(/^calendar-day-cell-/);
      expect(octCells.length).toBe(35);

      // 7 column headers (Mon - Sun)
      expect(screen.getByText('Mon')).toBeDefined();
      expect(screen.getByText('Tue')).toBeDefined();
      expect(screen.getByText('Wed')).toBeDefined();
      expect(screen.getByText('Thu')).toBeDefined();
      expect(screen.getByText('Fri')).toBeDefined();
      expect(screen.getByText('Sat')).toBeDefined();
      expect(screen.getByText('Sun')).toBeDefined();

      // August 2026 desktop grid: Mon Jul 27 to Sun Sep 6 = 42 cells
      rerender(<MonthGrid currentDate={new Date(2026, 7, 1)} posts={[]} />);
      const augCells = screen.getAllByTestId(/^calendar-day-cell-/);
      expect(augCells.length).toBe(42);
    });

    it('matches posts to the correct day cell by date string', () => {
      render(
        <MonthGrid currentDate={new Date(2026, 9, 1)} posts={samplePosts} />
      );

      const oct15Cell = screen.getByTestId('calendar-day-cell-2026-10-15');
      expect(oct15Cell.textContent).toContain('Morning announcement');
      expect(oct15Cell.textContent).toContain('+1 more');

      const oct17Cell = screen.getByTestId('calendar-day-cell-2026-10-17');
      expect(oct17Cell.textContent).toContain('Weekend kickoff');

      const oct16Cell = screen.getByTestId('calendar-day-cell-2026-10-16');
      expect(oct16Cell.textContent).not.toContain('Weekend kickoff');
    });

    it('invokes onSelectDay callback when a day is selected', () => {
      const handleSelectDay = vi.fn();
      render(
        <MonthGrid
          currentDate={new Date(2026, 9, 1)}
          posts={samplePosts}
          onSelectDay={handleSelectDay}
        />
      );

      const oct15Cell = screen.getByTestId('calendar-day-cell-2026-10-15');
      fireEvent.click(oct15Cell);

      expect(handleSelectDay).toHaveBeenCalled();
      const calledDate: Date = handleSelectDay.mock.calls[0][0];
      expect(calledDate.getDate()).toBe(15);
      expect(calledDate.getMonth()).toBe(9);
    });

    it('renders mobile agenda view with date selector dots and day post list', () => {
      render(
        <MonthGrid currentDate={new Date(2026, 9, 15)} posts={samplePosts} />
      );

      // Mobile date matrix dots exist
      const mobileDots = screen.getAllByTestId(/^agenda-day-dot-/);
      expect(mobileDots.length).toBeGreaterThan(0);

      // Oct 15 has 4 posts, should show full scheduled post cards in mobile agenda
      const agendaView = screen.getByTestId('mobile-agenda-view');
      expect(
        within(agendaView).getByText('Morning announcement')
      ).toBeDefined();
      expect(within(agendaView).getByText('Late night drop')).toBeDefined();

      // Switch active day to an empty day in mobile matrix
      const oct20Button = screen.getByTestId('mobile-matrix-day-2026-10-20');
      fireEvent.click(oct20Button);

      // Shows empty state with "+ Schedule on this day" link
      expect(within(agendaView).getByText(/no scheduled posts/i)).toBeDefined();
      const scheduleBtn = within(agendaView).getByRole('link', {
        name: /\+ schedule on this day/i,
      });
      expect(scheduleBtn.getAttribute('href')).toBe(
        '/studio/compose?date=2026-10-20'
      );
    });
  });
});
