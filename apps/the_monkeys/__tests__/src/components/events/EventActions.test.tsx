import { EventActions } from '@/components/events/EventActions';
import { EventItem } from '@/services/events/eventTypes';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../utils';

afterEach(cleanup);

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock useRefreshEvents
vi.mock('@/hooks/events/useRefreshEvents', () => ({
  useRefreshEvents: () => vi.fn(),
}));

const mockEvent: EventItem = {
  id: 1,
  title: 'Open Source Community Hangout',
  slug: 'open-source-community-hangout',
  description: 'Hangout with contributors.',
  start_time: '2026-11-25T15:00:00.000Z',
  end_time: '2026-11-25T16:30:00.000Z',
  timezone: 'UTC',
  event_type: 'in_person',
  location: 'Coffee & Code Cafe',
  status: 'published',
};

describe('EventActions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders "Add to calendar" menu button instead of a bare download button', () => {
    renderWithProviders(<EventActions event={mockEvent} />);

    // Old Calendar button is replaced
    const calendarBtn = screen.queryByRole('button', { name: /^calendar$/i });
    expect(calendarBtn).toBeNull();

    // New Add to calendar menu trigger is present
    const addCalendarBtn = screen.getByRole('button', {
      name: /add to calendar/i,
    });
    expect(addCalendarBtn).toBeDefined();

    // Share button is present
    expect(screen.getByRole('button', { name: /share/i })).toBeDefined();
  });

  it('opens calendar options when "Add to calendar" is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EventActions event={mockEvent} />);

    const addCalendarBtn = screen.getByRole('button', {
      name: /add to calendar/i,
    });
    await user.click(addCalendarBtn);

    expect(screen.getByRole('menuitem', { name: /google/i })).toBeDefined();
    expect(screen.getByRole('menuitem', { name: /outlook/i })).toBeDefined();
    expect(
      screen.getByRole('menuitem', { name: /apple \/ \.ics/i })
    ).toBeDefined();
    expect(screen.getByRole('menuitem', { name: /yahoo/i })).toBeDefined();
  });

  it('renders management actions for hosts', () => {
    renderWithProviders(<EventActions event={mockEvent} canManage={true} />);

    expect(screen.getByRole('link', { name: /manage/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /edit/i })).toBeDefined();
  });
});
