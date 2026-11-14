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
const coverState = vi.hoisted(() => ({ pending: false }));
vi.mock('@/hooks/events/useEventQueries', () => ({
  useUploadEventCover: () => ({
    isPending: coverState.pending,
    mutate: vi.fn(),
  }),
}));
vi.mock('@/features/content-readiness/EventReadiness', () => ({
  EventReadiness: ({ readValues, context }: any) => (
    <button
      type='button'
      onClick={() => {
        const projection = readValues();
        document.querySelector('[data-readiness-result]')!.textContent =
          JSON.stringify({ projection, context });
      }}
    >
      Check readiness
    </button>
  ),
}));

beforeEach(() => {
  coverState.pending = false;
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

it('projects current unsaved public fields for readiness without submitting or including meeting access', () => {
  const onSubmit = vi.fn();
  const { container } = renderWithProviders(
    <EventForm submitLabel='Save draft' onSubmit={onSubmit} />
  );
  const result = document.createElement('output');
  result.dataset.readinessResult = '';
  container.append(result);
  fireEvent.change(document.querySelector('[name="title"]')!, {
    target: { value: 'Unsaved community meetup' },
  });
  fireEvent.change(document.querySelector('[name="description"]')!, {
    target: { value: 'What the group will explore together.' },
  });
  fireEvent.change(document.querySelector('[name="meeting_link"]')!, {
    target: { value: 'https://private.example.test/secret-meeting-token' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Check readiness' }));
  const captured = JSON.parse(result.textContent!);
  expect(captured.projection).toMatchObject({
    title: 'Unsaved community meetup',
    description: 'What the group will explore together.',
    eventType: 'virtual',
  });
  expect(result.textContent).not.toContain('secret-meeting-token');
  expect(result.textContent).not.toContain('meeting_link');
  expect(onSubmit).not.toHaveBeenCalled();
});

it('supplies the original DST instants and current zone to read-only event analysis', () => {
  const event = {
    id: 40,
    slug: 'saved-fold',
    title: 'Existing event',
    event_type: 'virtual' as const,
    status: 'published' as const,
    timezone: 'Europe/Berlin',
    start_time: '2099-10-25T00:30:12Z',
    end_time: '2099-10-25T01:30:54Z',
    visibility: 'public',
  };
  const onSubmit = vi.fn();
  const { container } = renderWithProviders(
    <EventForm event={event} submitLabel='Save changes' onSubmit={onSubmit} />
  );
  const result = document.createElement('output');
  result.dataset.readinessResult = '';
  container.append(result);
  fireEvent.click(screen.getByRole('button', { name: 'Check readiness' }));
  expect(JSON.parse(result.textContent!).context).toMatchObject({
    savedStart: event.start_time,
    savedEnd: event.end_time,
    savedTimezone: 'Europe/Berlin',
    isExistingEvent: true,
  });
  expect(JSON.parse(result.textContent!).projection.timezone).toBe(
    'Europe/Berlin'
  );
  expect(onSubmit).not.toHaveBeenCalled();
});

it('keeps absent legacy event visibility unknown until the host explicitly chooses it', () => {
  const event = {
    id: 50,
    slug: 'legacy-visibility',
    title: 'Legacy event',
    event_type: 'virtual' as const,
    status: 'published' as const,
  };
  const { container } = renderWithProviders(
    <EventForm event={event} submitLabel='Save changes' onSubmit={vi.fn()} />
  );
  const result = document.createElement('output');
  result.dataset.readinessResult = '';
  container.append(result);
  fireEvent.click(screen.getByRole('button', { name: 'Check readiness' }));
  expect(JSON.parse(result.textContent!).projection.visibility).toBeUndefined();
  fireEvent.click(screen.getByText('More event options'));
  fireEvent.click(screen.getByRole('button', { name: /Public/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Check readiness' }));
  expect(JSON.parse(result.textContent!).projection.visibility).toBe('public');
});

it('includes pending replacement cover uploads in the readiness projection', () => {
  const event = {
    id: 51,
    slug: 'pending-cover',
    title: 'Existing cover',
    cover_image: '/old-cover.jpg',
    event_type: 'virtual' as const,
    status: 'published' as const,
    visibility: 'public',
  };
  const view = renderWithProviders(
    <EventForm event={event} submitLabel='Save changes' onSubmit={vi.fn()} />
  );
  const result = document.createElement('output');
  result.dataset.readinessResult = '';
  view.container.append(result);
  coverState.pending = true;
  view.rerender(
    <EventForm event={event} submitLabel='Save changes' onSubmit={vi.fn()} />
  );
  fireEvent.click(screen.getByRole('button', { name: 'Check readiness' }));
  expect(JSON.parse(result.textContent!).projection.coverPending).toBe(true);
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
