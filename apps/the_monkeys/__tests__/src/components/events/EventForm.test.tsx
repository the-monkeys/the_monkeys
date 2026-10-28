import { EventForm } from '@/components/events/EventForm';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../utils';

vi.mock('@/hooks/auth/useAuth', () => ({ default: () => ({ data: null }) }));
vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useUserGroups: () => ({ data: { groups: [] } }),
}));
vi.mock('@/hooks/useIPLocation', () => ({ useIPLocation: () => ({}) }));

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it('allows a native submit of an unchanged event spanning the repeated DST hour', async () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-01T00:00:00Z'));
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  renderWithProviders(
    <EventForm
      submitLabel='Save changes'
      onSubmit={onSubmit}
      event={{
        id: 3,
        slug: 'cross-fold',
        title: 'Cross-fold meetup',
        event_type: 'virtual',
        status: 'published',
        timezone: 'Europe/Berlin',
        start_time: '2026-10-25T00:45:00Z',
        end_time: '2026-10-25T01:15:00Z',
      }}
    />
  );
  const save = screen.getByRole('button', { name: 'Save changes' });
  expect(save.closest('form')!.checkValidity()).toBe(true);
  await user.click(save);
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      start_time: '2026-10-25T00:45:00.000Z',
      end_time: '2026-10-25T01:15:00.000Z',
    }),
    undefined
  );
});

it('allows a future saved second-fold start even when its wall time precedes now', async () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-25T00:50:00Z'));
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  renderWithProviders(
    <EventForm
      submitLabel='Save changes'
      onSubmit={onSubmit}
      event={{
        id: 4,
        slug: 'second-fold',
        title: 'Second-fold meetup',
        event_type: 'virtual',
        status: 'published',
        timezone: 'Europe/Berlin',
        start_time: '2026-10-25T01:30:00Z',
        end_time: '2026-10-25T02:30:00Z',
      }}
    />
  );
  const save = screen.getByRole('button', { name: 'Save changes' });
  expect(save.closest('form')!.checkValidity()).toBe(true);
  await user.click(save);
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ start_time: '2026-10-25T01:30:00.000Z' }),
    undefined
  );
});

it.each([
  ['2026-10-25T00:50:00Z', '2026-10-25T01:30:00Z', '2026-10-25T01:15:00Z'],
  ['2026-10-25T00:30:00Z', '2026-10-25T01:15:00Z', '2026-10-25T00:45:00Z'],
])(
  'allows an unchanged fold RSVP deadline after now %s',
  async (now, start, closes) => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(now));
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(
      <EventForm
        submitLabel='Save changes'
        onSubmit={onSubmit}
        event={{
          id: 5,
          slug: 'fold-rsvp',
          title: 'Fold RSVP meetup',
          event_type: 'virtual',
          status: 'published',
          timezone: 'Europe/Berlin',
          start_time: start,
          end_time: '2026-10-25T02:30:00Z',
          rsvp_closes_at: closes,
        }}
      />
    );
    const save = screen.getByRole('button', { name: 'Save changes' });
    expect(save.closest('form')!.checkValidity()).toBe(true);
    await user.click(save);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        rsvp_closes_at: new Date(closes).toISOString(),
      }),
      undefined
    );
  }
);

it.each([
  ['2026-10-25T02:30', '2026-10-25T04:00', /occurs twice/],
  ['2026-03-29T02:30', '2026-03-29T04:00', /does not exist/],
  ['2026-11-12T19:00', '2026-11-12T18:00', /End time must be after/],
  ['2025-11-12T19:00', '2025-11-12T20:00', /Start time cannot be in the past/],
])(
  'still rejects an invalid changed schedule starting %s',
  (start, end, message) => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    const onSubmit = vi.fn();
    renderWithProviders(
      <EventForm submitLabel='Save draft' onSubmit={onSubmit} />
    );
    fireEvent.change(screen.getByRole('combobox', { name: 'Event timezone' }), {
      target: { value: 'Europe/Berlin' },
    });
    fireEvent.change(document.querySelector('[name="start"]')!, {
      target: { value: start },
    });
    fireEvent.change(document.querySelector('[name="end"]')!, {
      target: { value: end },
    });
    fireEvent.submit(
      screen.getByRole('button', { name: 'Save draft' }).closest('form')!
    );
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(message)).toBeTruthy();
  }
);

it('uses the visible event timezone for the submitted UTC schedule', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  renderWithProviders(
    <EventForm submitLabel='Save draft' onSubmit={onSubmit} />
  );
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Event timezone' }),
    'Asia/Kolkata'
  );
  fireEvent.change(document.querySelector('[name="title"]')!, {
    target: { value: 'India meetup' },
  });
  fireEvent.change(document.querySelector('[name="start"]')!, {
    target: { value: '2099-11-12T19:00' },
  });
  fireEvent.change(document.querySelector('[name="end"]')!, {
    target: { value: '2099-11-12T20:30' },
  });
  await user.click(screen.getByRole('button', { name: 'Save draft' }));
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      timezone: 'Asia/Kolkata',
      start_time: '2099-11-12T13:30:00.000Z',
      end_time: '2099-11-12T15:00:00.000Z',
    }),
    undefined
  );
});

it('initializes an edit in the saved event timezone and preserves its instant', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  renderWithProviders(
    <EventForm
      submitLabel='Save changes'
      onSubmit={onSubmit}
      event={{
        id: 1,
        slug: 'india-meetup',
        title: 'India meetup',
        event_type: 'virtual',
        status: 'draft',
        timezone: 'Asia/Kolkata',
        start_time: '2099-11-12T13:30:00Z',
        end_time: '2099-11-12T15:00:00Z',
      }}
    />
  );
  expect(
    (document.querySelector('[name="start"]') as HTMLInputElement).value
  ).toBe('2099-11-12T19:00');
  await user.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ start_time: '2099-11-12T13:30:00.000Z' }),
    undefined
  );
});

it('preserves an unchanged saved instant inside the repeated DST hour', async () => {
  vi.spyOn(Date, 'now').mockReturnValue(Date.parse('2026-10-01T00:00:00Z'));
  const onSubmit = vi.fn();
  renderWithProviders(
    <EventForm
      submitLabel='Save changes'
      onSubmit={onSubmit}
      event={{
        id: 2,
        slug: 'dst-meetup',
        title: 'DST meetup',
        event_type: 'virtual',
        status: 'published',
        timezone: 'Europe/Berlin',
        start_time: '2026-10-25T00:30:45Z',
        end_time: '2026-10-25T02:30:45Z',
      }}
    />
  );
  fireEvent.submit(
    screen.getByRole('button', { name: 'Save changes' }).closest('form')!
  );
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      start_time: '2026-10-25T00:30:45.000Z',
      end_time: '2026-10-25T02:30:45.000Z',
    }),
    undefined
  );
});

it('uses radio controls for repeat and visibility cards, without ticket options', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  renderWithProviders(
    <EventForm submitLabel='Save draft' onSubmit={onSubmit} />
  );

  fireEvent.change(document.querySelector('[name="title"]')!, {
    target: { value: 'A future meetup' },
  });
  fireEvent.change(document.querySelector('[name="start"]')!, {
    target: { value: '2099-01-01T10:00' },
  });
  fireEvent.change(document.querySelector('[name="end"]')!, {
    target: { value: '2099-01-01T11:00' },
  });
  await user.click(screen.getByText('More event options'));
  expect(screen.queryByLabelText('Add a ticket')).toBeNull();

  await user.click(screen.getByRole('radio', { name: 'Weekly' }));
  await user.click(screen.getByRole('button', { name: /private/i }));
  await user.click(screen.getByRole('button', { name: 'Save draft' }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      visibility: 'private',
      recurrence: expect.objectContaining({ freq: 'weekly' }),
    }),
    undefined
  );
});
