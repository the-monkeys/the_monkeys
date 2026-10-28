import { EventSidebarMeta } from '@/components/events/detail/EventSidebarMeta';
import { GroupEventForm } from '@/components/groups/GroupEventForm';
import * as eventTime from '@/lib/eventTime';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('@/hooks/useIPLocation', () => ({ useIPLocation: () => ({}) }));
vi.mock('@/components/geo/PlacePin', () => ({ PlacePin: () => null }));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it('shows an India viewer their local time rather than the event European zone', async () => {
  vi.spyOn(eventTime, 'defaultTimezone').mockReturnValue('Asia/Kolkata');
  render(
    <EventSidebarMeta
      event={{
        id: 1,
        slug: 'meetup',
        title: 'Meetup',
        event_type: 'virtual',
        status: 'published',
        timezone: 'Europe/Berlin',
        start_time: '2026-11-12T13:30:00Z',
        end_time: '2026-11-12T15:00:00Z',
      }}
    />
  );
  await waitFor(() =>
    expect(screen.getByText(/7:00 PM|19:00/).textContent).toMatch(
      /GMT\+5:30|IST/
    )
  );
  expect(screen.queryByText(/2:30 PM|14:30/)).toBeNull();
});

it('converts a group-event schedule using its selected timezone', async () => {
  const onSubmit = vi.fn();
  render(<GroupEventForm submitLabel='Save group event' onSubmit={onSubmit} />);
  fireEvent.change(screen.getByRole('combobox', { name: 'Event timezone' }), {
    target: { value: 'Asia/Kolkata' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Online' }));
  fireEvent.change(document.querySelector('[name="title"]')!, {
    target: { value: 'Group meetup' },
  });
  fireEvent.change(document.querySelector('[name="start"]')!, {
    target: { value: '2099-11-12T19:00' },
  });
  fireEvent.change(document.querySelector('[name="end"]')!, {
    target: { value: '2099-11-12T20:30' },
  });
  fireEvent.submit(
    screen.getByRole('button', { name: 'Save group event' }).closest('form')!
  );
  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        timezone: 'Asia/Kolkata',
        start_time: '2099-11-12T13:30:00.000Z',
        end_time: '2099-11-12T15:00:00.000Z',
      })
    )
  );
});
