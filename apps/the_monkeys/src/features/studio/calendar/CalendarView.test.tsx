import type { SocialPost } from '@/features/studio/types';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CalendarView from './CalendarView';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockRefetch = vi.fn();
const mockUseSocialCalendar = vi.fn();

vi.mock('@/hooks/studio/useSocialPosts', () => ({
  useSocialCalendar: (...args: unknown[]) => mockUseSocialCalendar(...args),
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
    scheduled_at: '2026-10-15T09:30:00Z',
    schedule_timezone: 'UTC',
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
    renditions: [{ platform: 'x', social_account_id: 'acc-1' }],
  },
  {
    id: 'post-2',
    base_text: 'Afternoon update',
    state: 'scheduled',
    status: 'scheduled',
    version: 1,
    scheduled_at: '2026-10-16T14:00:00Z',
    schedule_timezone: 'UTC',
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
    renditions: [{ platform: 'linkedin', social_account_id: 'acc-2' }],
  },
];

describe('CalendarView', () => {
  const baseDate = new Date(2026, 9, 15); // October 15, 2026 (Thursday)

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSocialCalendar.mockReturnValue({
      data: { items: samplePosts },
      isLoading: false,
      isError: false,
      refetch: mockRefetch,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Initial rendering & Toolbar', () => {
    it('renders toolbar with month heading, navigation controls, segmented toggle, + New Post link, and timezone pill', () => {
      render(<CalendarView initialDate={baseDate} timezone='UTC' />);

      // Dynamic month heading
      expect(
        screen.getByRole('heading', { name: 'October 2026' })
      ).toBeDefined();

      // Navigation buttons
      expect(screen.getByRole('button', { name: /prev/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /today/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /next/i })).toBeDefined();

      // Segmented toggle
      expect(screen.getByRole('button', { name: /^month$/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /^week$/i })).toBeDefined();

      // + New Post link
      const newPostLink = screen.getByRole('link', { name: /\+ New Post/i });
      expect(newPostLink).toBeDefined();
      expect(newPostLink.getAttribute('href')).toBe('/studio/compose');

      // Timezone pill
      expect(screen.getByTestId('calendar-timezone')).toBeDefined();
      expect(screen.getByTestId('calendar-timezone').textContent).toContain(
        'UTC'
      );
    });

    it('renders MonthGrid by default', () => {
      render(<CalendarView initialDate={baseDate} />);

      // MonthGrid elements (7 weekday headers in desktop view)
      expect(screen.getByText('Mon')).toBeDefined();
      expect(screen.getByText('Sun')).toBeDefined();
      // Sample post rendered in month view (desktop + mobile)
      expect(
        screen.getAllByText('Morning announcement').length
      ).toBeGreaterThan(0);
    });
  });

  describe('View Mode Toggle', () => {
    it('toggles view mode between Month and Week', () => {
      render(<CalendarView initialDate={baseDate} />);

      // Initially in month mode
      expect(
        screen.getByRole('heading', { name: 'October 2026' })
      ).toBeDefined();
      expect(screen.queryByTestId('desktop-week-view')).toBeNull();

      // Switch to week view
      fireEvent.click(screen.getByRole('button', { name: /^week$/i }));

      // Heading should now show week range: Oct 12 – Oct 18, 2026
      expect(
        screen.getByRole('heading', { name: /Oct 12 – Oct 18, 2026/i })
      ).toBeDefined();
      // WeekGrid is rendered
      expect(screen.getByTestId('desktop-week-view')).toBeDefined();

      // Switch back to month view
      fireEvent.click(screen.getByRole('button', { name: /^month$/i }));

      expect(
        screen.getByRole('heading', { name: 'October 2026' })
      ).toBeDefined();
      expect(screen.queryByTestId('desktop-week-view')).toBeNull();
    });
  });

  describe('Date Navigation', () => {
    it('in month mode: navigates to previous and next month, and resets to today', () => {
      render(<CalendarView initialDate={baseDate} />);

      expect(
        screen.getByRole('heading', { name: 'October 2026' })
      ).toBeDefined();

      // Click Prev -> September 2026
      fireEvent.click(screen.getByRole('button', { name: /prev/i }));
      expect(
        screen.getByRole('heading', { name: 'September 2026' })
      ).toBeDefined();

      // Click Next twice -> October 2026 -> November 2026
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      expect(
        screen.getByRole('heading', { name: 'October 2026' })
      ).toBeDefined();
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      expect(
        screen.getByRole('heading', { name: 'November 2026' })
      ).toBeDefined();

      // Click Today -> resets to current month
      const currentMonthHeading = format(new Date(), 'MMMM yyyy');
      fireEvent.click(screen.getByRole('button', { name: /today/i }));
      expect(
        screen.getByRole('heading', { name: currentMonthHeading })
      ).toBeDefined();
    });

    it('in week mode: navigates to previous and next week, and resets to today', () => {
      render(<CalendarView initialDate={baseDate} initialViewMode='week' />);

      expect(
        screen.getByRole('heading', { name: /Oct 12 – Oct 18, 2026/i })
      ).toBeDefined();

      // Click Prev -> Oct 5 – Oct 11, 2026
      fireEvent.click(screen.getByRole('button', { name: /prev/i }));
      expect(
        screen.getByRole('heading', { name: /Oct 5 – Oct 11, 2026/i })
      ).toBeDefined();

      // Click Next twice -> Oct 12 – Oct 18, 2026 -> Oct 19 – Oct 25, 2026
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      expect(
        screen.getByRole('heading', { name: /Oct 12 – Oct 18, 2026/i })
      ).toBeDefined();
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      expect(
        screen.getByRole('heading', { name: /Oct 19 – Oct 25, 2026/i })
      ).toBeDefined();

      // Click Today -> resets to current week
      const now = new Date();
      const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
      const currentWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
      const expectedCurrentHeading =
        currentWeekStart.getFullYear() !== currentWeekEnd.getFullYear()
          ? `${format(currentWeekStart, 'MMM d, yyyy')} – ${format(currentWeekEnd, 'MMM d, yyyy')}`
          : `${format(currentWeekStart, 'MMM d')} – ${format(currentWeekEnd, 'MMM d, yyyy')}`;

      fireEvent.click(screen.getByRole('button', { name: /today/i }));
      expect(
        screen.getByRole('heading', { name: expectedCurrentHeading })
      ).toBeDefined();
    });
  });

  describe('Query Parameters (from / to)', () => {
    it('computes month interval for useSocialCalendar and updates when navigating', () => {
      render(<CalendarView initialDate={baseDate} />);

      // First call for October 2026 month mode:
      // Start: startOfWeek(startOfMonth(Oct 15, 2026), { weekStartsOn: 1 }) -> Sep 28, 2026
      // End: endOfWeek(endOfMonth(Oct 15, 2026), { weekStartsOn: 1 }) -> Nov 1, 2026
      const expectedStart = startOfWeek(startOfMonth(baseDate), {
        weekStartsOn: 1,
      }).toISOString();
      const expectedEnd = endOfWeek(endOfMonth(baseDate), {
        weekStartsOn: 1,
      }).toISOString();

      expect(mockUseSocialCalendar).toHaveBeenCalledWith({
        from: expectedStart,
        to: expectedEnd,
        page_size: 100,
      });

      // Navigate to previous month (September 2026)
      fireEvent.click(screen.getByRole('button', { name: /prev/i }));

      const prevMonthDate = new Date(2026, 8, 15);
      const expectedPrevStart = startOfWeek(startOfMonth(prevMonthDate), {
        weekStartsOn: 1,
      }).toISOString();
      const expectedPrevEnd = endOfWeek(endOfMonth(prevMonthDate), {
        weekStartsOn: 1,
      }).toISOString();

      expect(mockUseSocialCalendar).toHaveBeenCalledWith({
        from: expectedPrevStart,
        to: expectedPrevEnd,
        page_size: 100,
      });
    });

    it('computes week interval for useSocialCalendar in week mode', () => {
      render(<CalendarView initialDate={baseDate} initialViewMode='week' />);

      // In week mode:
      // Start: startOfWeek(Oct 15, 2026, { weekStartsOn: 1 }) -> Oct 12, 2026
      // End: endOfWeek(Oct 15, 2026, { weekStartsOn: 1 }) -> Oct 18, 2026
      const expectedWeekStart = startOfWeek(baseDate, {
        weekStartsOn: 1,
      }).toISOString();
      const expectedWeekEnd = endOfWeek(baseDate, {
        weekStartsOn: 1,
      }).toISOString();

      expect(mockUseSocialCalendar).toHaveBeenCalledWith({
        from: expectedWeekStart,
        to: expectedWeekEnd,
        page_size: 100,
      });
    });
  });

  describe('Loading and Error States', () => {
    it('renders loading skeleton when calendar data is loading', () => {
      mockUseSocialCalendar.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: mockRefetch,
      });

      render(<CalendarView initialDate={baseDate} />);

      expect(screen.getByTestId('calendar-skeleton')).toBeDefined();
    });

    it('renders error state and calls refetch when Try again is clicked', () => {
      mockUseSocialCalendar.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        refetch: mockRefetch,
      });

      render(<CalendarView initialDate={baseDate} />);

      expect(screen.getByTestId('calendar-error')).toBeDefined();
      expect(screen.getByText(/unable to load calendar posts/i)).toBeDefined();

      const retryBtn = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(retryBtn);

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });
});
