import React from 'react';

import type { SocialPost } from '@/features/studio/types';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import WeekGrid from './WeekGrid';

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
    scheduled_at: '2026-10-15T22:30:00',
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

describe('WeekGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  // Oct 15, 2026 is a Thursday. Week starts Monday Oct 12, 2026 and ends Sunday Oct 18, 2026.
  const targetDate = new Date(2026, 9, 15);

  describe('Desktop View (>= 768px)', () => {
    it('renders 7 day columns for the active week with headers', () => {
      render(<WeekGrid currentDate={targetDate} posts={samplePosts} />);

      const desktopColumns = screen.getAllByTestId(/^desktop-day-column-/);
      expect(desktopColumns.length).toBe(7);

      // Check date columns for Oct 12 through Oct 18
      expect(screen.getByTestId('desktop-day-column-2026-10-12')).toBeDefined();
      expect(screen.getByTestId('desktop-day-column-2026-10-13')).toBeDefined();
      expect(screen.getByTestId('desktop-day-column-2026-10-14')).toBeDefined();
      expect(screen.getByTestId('desktop-day-column-2026-10-15')).toBeDefined();
      expect(screen.getByTestId('desktop-day-column-2026-10-16')).toBeDefined();
      expect(screen.getByTestId('desktop-day-column-2026-10-17')).toBeDefined();
      expect(screen.getByTestId('desktop-day-column-2026-10-18')).toBeDefined();

      // Check weekday headers
      const desktopContainer = screen.getByTestId('desktop-week-view');
      expect(within(desktopContainer).getByText(/Mon/i)).toBeDefined();
      expect(within(desktopContainer).getByText(/Sun/i)).toBeDefined();
    });

    it('renders 24-hour time axis with hourly slots from 00:00 to 23:00', () => {
      render(<WeekGrid currentDate={targetDate} posts={samplePosts} />);

      // Check 24 hour slots for a day column
      for (let h = 0; h < 24; h++) {
        expect(
          screen.getByTestId(`desktop-hour-slot-2026-10-15-${h}`)
        ).toBeDefined();
      }
    });

    it('positions scheduled posts in their correct day and hour cell', () => {
      render(<WeekGrid currentDate={targetDate} posts={samplePosts} />);

      // Oct 15 at 09:30 should be in hour 9 slot
      const hour9Slot = screen.getByTestId('desktop-hour-slot-2026-10-15-9');
      expect(within(hour9Slot).getByText('Morning announcement')).toBeDefined();
      expect(within(hour9Slot).getByText(/9:30 AM/i)).toBeDefined();

      // Oct 15 at 11:30 should be in hour 11 slot
      const hour11Slot = screen.getByTestId('desktop-hour-slot-2026-10-15-11');
      expect(within(hour11Slot).getByText('Afternoon insights')).toBeDefined();

      // Oct 17 at 11:00 should be in Oct 17 hour 11 slot
      const oct17Slot = screen.getByTestId('desktop-hour-slot-2026-10-17-11');
      expect(within(oct17Slot).getByText('Weekend kickoff')).toBeDefined();

      // Hour 10 on Oct 15 is empty
      const hour10Slot = screen.getByTestId('desktop-hour-slot-2026-10-15-10');
      expect(within(hour10Slot).queryByText('Morning announcement')).toBeNull();
    });

    it('navigates to /studio/compose/:id when post card is clicked', () => {
      render(<WeekGrid currentDate={targetDate} posts={samplePosts} />);

      const postCard = screen.getByTestId('week-post-card-post-1');
      fireEvent.click(postCard);

      expect(mockPush).toHaveBeenCalledWith('/studio/compose/post-1');
    });

    it('opens PostActionsMenu without navigating to composer', () => {
      render(<WeekGrid currentDate={targetDate} posts={samplePosts} />);

      const postCard = screen.getByTestId('week-post-card-post-1');
      const actionBtn = within(postCard).getByRole('button', {
        name: /post actions/i,
      });

      fireEvent.click(actionBtn);

      expect(screen.getByText(/edit in composer/i)).toBeDefined();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('navigates to /studio/compose?date=YYYY-MM-DDTHH:00:00 when clicking an empty hourly slot', () => {
      render(<WeekGrid currentDate={targetDate} posts={samplePosts} />);

      const emptySlot = screen.getByTestId('desktop-hour-slot-2026-10-15-10');
      fireEvent.click(emptySlot);

      expect(mockPush).toHaveBeenCalledWith(
        '/studio/compose?date=2026-10-15T10:00:00'
      );
    });

    it('renders real-time indicator bar when active week includes today', () => {
      const today = new Date();
      render(<WeekGrid currentDate={today} posts={[]} />);

      const indicator = screen.getByTestId('current-time-indicator');
      expect(indicator).toBeDefined();
    });

    it('does not render real-time indicator bar when active week is not current week', () => {
      // Use date far in the future
      const futureDate = new Date(2035, 5, 15);
      render(<WeekGrid currentDate={futureDate} posts={[]} />);

      expect(screen.queryByTestId('current-time-indicator')).toBeNull();
    });
  });

  describe('Mobile View (< 768px)', () => {
    it('renders horizontal day tab bar for 7 days of the active week', () => {
      render(<WeekGrid currentDate={targetDate} posts={samplePosts} />);

      const mobileTabs = screen.getAllByTestId(/^mobile-day-tab-/);
      expect(mobileTabs.length).toBe(7);

      expect(screen.getByTestId('mobile-day-tab-2026-10-12')).toBeDefined();
      expect(screen.getByTestId('mobile-day-tab-2026-10-15')).toBeDefined();
      expect(screen.getByTestId('mobile-day-tab-2026-10-18')).toBeDefined();
    });

    it('renders selected day 24-hour timeline and switches day when tab is clicked', () => {
      const handleSelectDay = vi.fn();
      render(
        <WeekGrid
          currentDate={targetDate}
          posts={samplePosts}
          onSelectDay={handleSelectDay}
        />
      );

      const mobileView = screen.getByTestId('mobile-week-view');

      // Initial day is targetDate (Oct 15). Shows Oct 15 posts in mobile timeline
      expect(
        within(mobileView).getByText('Morning announcement')
      ).toBeDefined();
      expect(within(mobileView).getByText('Afternoon insights')).toBeDefined();
      expect(within(mobileView).queryByText('Weekend kickoff')).toBeNull();

      // Click on Saturday Oct 17 tab
      const oct17Tab = screen.getByTestId('mobile-day-tab-2026-10-17');
      fireEvent.click(oct17Tab);

      expect(handleSelectDay).toHaveBeenCalled();

      // Now mobile timeline displays Oct 17 posts
      expect(within(mobileView).getByText('Weekend kickoff')).toBeDefined();
      expect(within(mobileView).queryByText('Morning announcement')).toBeNull();
    });

    it('navigates to /studio/compose?date=YYYY-MM-DDTHH:00:00 when tapping an empty mobile hour slot', () => {
      render(<WeekGrid currentDate={targetDate} posts={samplePosts} />);

      const mobileHourSlot = screen.getByTestId(
        'mobile-hour-slot-2026-10-15-8'
      );
      fireEvent.click(mobileHourSlot);

      expect(mockPush).toHaveBeenCalledWith(
        '/studio/compose?date=2026-10-15T08:00:00'
      );
    });
  });
});
