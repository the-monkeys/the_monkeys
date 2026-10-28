import { EventActions } from '@/components/events/EventActions';
import { EventItem } from '@/services/events/eventTypes';
import { cloneEvent, downloadCalendar } from '@/services/events/eventsApi';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';

const { push, toast } = vi.hoisted(() => ({ push: vi.fn(), toast: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/hooks/events/useRefreshEvents', () => ({
  useRefreshEvents: () => async () => {},
}));
vi.mock('@the-monkeys/ui/hooks/use-toast', () => ({
  useToast: () => ({ toast }),
}));
vi.mock('@/services/events/eventsApi', () => ({
  cloneEvent: vi.fn(async () => ({ event: { slug: 'new-draft' } })),
  downloadCalendar: vi.fn(),
  eventError: () => 'Could not create draft',
  getShareMeta: vi.fn(),
  reportEvent: vi.fn(),
}));

const source: EventItem = {
  id: 1,
  slug: 'legacy-meetup',
  title: 'Legacy meetup',
  status: 'completed',
  event_type: 'virtual',
  timezone: 'India',
  start_time: '2026-01-01T13:30:00Z',
  end_time: '2026-01-01T15:00:00Z',
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it.each(['completed', 'published'] as const)(
  'uses the simple Edit label for %s events',
  (status) => {
    render(<EventActions event={{ ...source, status }} canManage />);
    expect(
      screen.getByRole('link', { name: 'Edit' }).getAttribute('href')
    ).toBe('/events/legacy-meetup/edit');
    expect(screen.queryByRole('link', { name: 'Edit writeup' })).toBeNull();
  }
);

it('offers provider choices without downloading anything until a choice is made', async () => {
  const user = userEvent.setup();
  render(<EventActions event={{ ...source, timezone: 'Asia/Kolkata' }} />);
  const trigger = screen.getByRole('button', { name: 'Add to calendar' });
  await user.click(trigger);
  expect(screen.getByRole('dialog', { name: 'Add to calendar' })).toBeTruthy();
  const google = new URL(
    screen.getByRole('link', { name: /Google Calendar/ }).getAttribute('href')!
  );
  expect(google.searchParams.get('dates')).toBe(
    '20260101T133000Z/20260101T150000Z'
  );
  expect(screen.getByRole('link', { name: /Outlook/ })).toBeTruthy();
  expect(downloadCalendar).not.toHaveBeenCalled();
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

it('exports only the selected date to Apple by default, including for a recurring event', async () => {
  const user = userEvent.setup();
  render(
    <EventActions
      event={{ ...source, series_id: 8, recurrence_text: 'Every week on Thu' }}
    />
  );
  await user.click(screen.getByRole('button', { name: 'Add to calendar' }));
  expect(
    (screen.getByRole('radio', { name: /This occurrence/ }) as HTMLInputElement)
      .checked
  ).toBe(true);
  await user.click(screen.getByRole('button', { name: /Apple Calendar/ }));
  await waitFor(() =>
    expect(downloadCalendar).toHaveBeenCalledWith('legacy-meetup', 'this')
  );
});

it('uses explicit import fallback for all providers when exporting available series dates', async () => {
  const user = userEvent.setup();
  render(
    <EventActions
      event={{ ...source, series_id: 8, recurrence_text: 'Every week on Thu' }}
    />
  );
  await user.click(screen.getByRole('button', { name: 'Add to calendar' }));
  await user.click(
    screen.getByRole('radio', { name: /Available series dates/ })
  );
  expect(
    screen.queryByRole('link', { name: /Google Calendar|Outlook/ })
  ).toBeNull();
  expect(
    screen.getByText(/Google Calendar imports calendar files on a computer/)
  ).toBeTruthy();
  expect(screen.getByText(/do not update automatically/i)).toBeTruthy();
  await user.click(screen.getByRole('button', { name: /Google Calendar/ }));
  await waitFor(() =>
    expect(downloadCalendar).toHaveBeenCalledWith('legacy-meetup', 'series')
  );
});

it('keeps export failures inside the dialog and lets the user retry', async () => {
  vi.mocked(downloadCalendar).mockRejectedValueOnce(
    new Error('Calendar series export is not available on this server yet.')
  );
  const user = userEvent.setup();
  render(<EventActions event={source} />);
  await user.click(screen.getByRole('button', { name: 'Add to calendar' }));
  await user.click(screen.getByRole('button', { name: /Apple Calendar/ }));
  expect((await screen.findByRole('alert')).textContent).toContain(
    'Calendar series export is not available'
  );
  await user.click(screen.getByRole('button', { name: /Apple Calendar/ }));
  await waitFor(() => expect(downloadCalendar).toHaveBeenCalledTimes(2));
});

it('offers cancellation-aware files instead of active provider appointments for a cancelled date', async () => {
  const user = userEvent.setup();
  render(<EventActions event={{ ...source, status: 'cancelled' }} />);
  await user.click(screen.getByRole('button', { name: 'Add to calendar' }));
  expect(
    screen.queryAllByRole('link', { name: /Google Calendar|Outlook/ })
  ).toHaveLength(0);
  expect(screen.getByText(/This occurrence was cancelled/)).toBeTruthy();
  await user.click(screen.getByRole('button', { name: /Google Calendar/ }));
  await waitFor(() =>
    expect(downloadCalendar).toHaveBeenCalledWith('legacy-meetup', 'this')
  );
});

it('requires a valid choice for a legacy timezone and applies it only to the new draft', async () => {
  const user = userEvent.setup();
  render(<EventActions event={source} canManage />);
  await user.click(screen.getByRole('button', { name: 'Schedule again' }));
  await user.click(screen.getByRole('button', { name: 'Create draft' }));
  expect(cloneEvent).not.toHaveBeenCalled();

  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Event timezone' }),
    'Asia/Kolkata'
  );
  fireEvent.change(screen.getByLabelText(/Starts/), {
    target: { value: '2099-11-12T19:00' },
  });
  fireEvent.change(screen.getByLabelText(/Ends/), {
    target: { value: '2099-11-12T20:30' },
  });
  await user.click(screen.getByRole('button', { name: 'Create draft' }));

  await waitFor(() =>
    expect(cloneEvent).toHaveBeenCalledWith('legacy-meetup', {
      timezone: 'Asia/Kolkata',
      start_time: '2099-11-12T13:30:00.000Z',
      end_time: '2099-11-12T15:00:00.000Z',
    })
  );
  expect(push).toHaveBeenCalledWith('/events/new-draft/edit');
  expect(source.timezone).toBe('India');
  expect(source.start_time).toBe('2026-01-01T13:30:00Z');
});

it('keeps a valid inherited event timezone when scheduling again', async () => {
  const user = userEvent.setup();
  render(
    <EventActions event={{ ...source, timezone: 'Europe/Berlin' }} canManage />
  );
  await user.click(screen.getByRole('button', { name: 'Schedule again' }));
  expect(
    (
      screen.getByRole('combobox', {
        name: 'Event timezone',
      }) as HTMLSelectElement
    ).value
  ).toBe('Europe/Berlin');
  fireEvent.change(screen.getByLabelText(/Starts/), {
    target: { value: '2099-11-12T19:00' },
  });
  fireEvent.change(screen.getByLabelText(/Ends/), {
    target: { value: '2099-11-12T20:30' },
  });
  await user.click(screen.getByRole('button', { name: 'Create draft' }));
  await waitFor(() =>
    expect(cloneEvent).toHaveBeenCalledWith('legacy-meetup', {
      timezone: 'Europe/Berlin',
      start_time: '2099-11-12T18:00:00.000Z',
      end_time: '2099-11-12T19:30:00.000Z',
    })
  );
});

it('does not create a draft for an ambiguous new local time', async () => {
  const user = userEvent.setup();
  render(
    <EventActions event={{ ...source, timezone: 'Europe/Berlin' }} canManage />
  );
  await user.click(screen.getByRole('button', { name: 'Schedule again' }));
  fireEvent.change(screen.getByLabelText(/Starts/), {
    target: { value: '2026-10-25T02:30' },
  });
  fireEvent.change(screen.getByLabelText(/Ends/), {
    target: { value: '2026-10-25T04:00' },
  });
  await user.click(screen.getByRole('button', { name: 'Create draft' }));
  expect(cloneEvent).not.toHaveBeenCalled();
  expect(toast).toHaveBeenCalledWith(
    expect.objectContaining({
      description: expect.stringMatching(/occurs twice/),
    })
  );
});
