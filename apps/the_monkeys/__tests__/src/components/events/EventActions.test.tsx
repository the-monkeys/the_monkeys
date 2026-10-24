import { EventActions } from '@/components/events/EventActions';
import { EventItem } from '@/services/events/eventTypes';
import { cloneEvent } from '@/services/events/eventsApi';
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
