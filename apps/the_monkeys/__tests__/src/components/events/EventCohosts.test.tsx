import { EventManage } from '@/components/events/EventManage';
import { queryKeys } from '@/lib/queryKeys';
import { EventItem } from '@/services/events/eventTypes';
import {
  addCoHost,
  getEvent,
  listAttendees,
  listCoupons,
  removeCoHost,
} from '@/services/events/eventsApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
// Only external services/navigation are replaced; render the real management
// component, query hooks, inputs, buttons and confirmation dialog.
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));
vi.mock('@/services/events/eventsApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/events/eventsApi')>()),
  addCoHost: vi.fn(),
  getEvent: vi.fn(),
  removeCoHost: vi.fn(),
  listAttendees: vi.fn(),
  listCoupons: vi.fn(),
}));

const event: EventItem = {
  id: 1,
  slug: 'local-cohosts',
  title: 'Local co-host meetup',
  status: 'published',
  event_type: 'virtual',
  organizer_username: 'organizer',
  co_host_usernames: ['viewer', 'another_host'],
};
let client: QueryClient;

beforeEach(() => {
  vi.resetAllMocks();
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  vi.mocked(listAttendees).mockResolvedValue({ attendees: [], total: 0 });
  vi.mocked(listCoupons).mockResolvedValue({ coupons: [] });
  vi.mocked(addCoHost).mockResolvedValue({});
  vi.mocked(removeCoHost).mockResolvedValue({});
});
afterEach(() => {
  cleanup();
  client.clear();
});

async function renderManage(username = 'viewer', currentEvent = event) {
  render(
    <QueryClientProvider client={client}>
      <EventManage
        event={currentEvent}
        session={{
          username,
          account_id: 'local-viewer',
          email: 'viewer@example.test',
        }}
      />
    </QueryClientProvider>
  );
  await screen.findByText('No attendees yet.');
}

function row(username: string) {
  return within(screen.getByText(`@${username}`).closest('li')!);
}
function addForm() {
  return screen.getByPlaceholderText('username').closest('form')!;
}
function enterUsername(username: string) {
  fireEvent.change(screen.getByPlaceholderText('username'), {
    target: { value: username },
  });
}
function deferred<T = object>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe('co-host management', () => {
  it.each([
    ['another_host', 'Remove'],
    ['viewer', 'Leave co-host'],
  ])(
    'preserves %s confirmation identity while closing and restores focus',
    async (username, label) => {
      const user = userEvent.setup();
      await renderManage();
      const trigger = row(username).getByRole('button', {
        name: label,
      });
      await user.click(trigger);
      const dialog = screen.getByRole('dialog');
      const confirmation = dialog.textContent;
      await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
      // Keep the actual DOM reference: Radix can retain the last rendered text
      // during its closing animation, even after open changes to false.
      expect(dialog.textContent).toBe(confirmation);
      expect(dialog.textContent).not.toContain('@null');
      await waitFor(() => expect(document.activeElement).toBe(trigger));
      expect(removeCoHost).not.toHaveBeenCalled();
    }
  );

  it.each([
    ['another_host', 'Remove', 'Remove co-host'],
    ['viewer', 'Leave co-host', 'Leave co-host'],
  ])(
    'uses the existing event brand action for %s confirmation',
    async (username, label, actionLabel) => {
      const user = userEvent.setup();
      await renderManage();
      await user.click(row(username).getByRole('button', { name: label }));
      expect(
        within(screen.getByRole('dialog')).getByRole('button', {
          name: actionLabel,
        }).className
      ).toContain('bg-brand-orange');
    }
  );

  it('cancels pending host reads and clears fresh event caches before self-leave navigation', async () => {
    client.setDefaultOptions({
      queries: { retry: false, gcTime: Infinity, staleTime: 60_000 },
    });
    const detailKey = queryKeys.events.detail(event.slug);
    const attendeeKey = queryKeys.events.attendeePage(event.slug, {
      limit: 50,
      offset: 0,
    });
    const previewKey = queryKeys.events.attendeePage(event.slug, {
      limit: 18,
      offset: 0,
      status: 'confirmed',
    });
    const couponKey = queryKeys.events.coupons(event.slug);
    const hostDetail = { event };
    const attendees = { attendees: [], total: 0 };
    const coupons = { coupons: [] };
    const hostEntries = [
      [detailKey, hostDetail],
      [queryKeys.events.attendees(event.slug), attendees],
      [attendeeKey, attendees],
      [previewKey, attendees],
      [couponKey, coupons],
    ] as const;
    for (const [queryKey, data] of hostEntries)
      client.setQueryData(queryKey, data);
    const otherEvent = {
      ...event,
      slug: 'unrelated-event',
      organizer_username: 'viewer',
    };
    const organizerSession = {
      username: 'organizer',
      account_id: 'local-organizer',
      email: 'organizer@example.test',
    };
    const preservedEntries = [
      [queryKeys.events.detail(otherEvent.slug), { event: otherEvent }],
      [
        queryKeys.events.attendeePage(otherEvent.slug, {
          limit: 50,
          offset: 0,
        }),
        attendees,
      ],
      [queryKeys.events.coupons(otherEvent.slug), coupons],
      [queryKeys.events.list({}), { events: [otherEvent], total: 1 }],
      [['current-user', 'organizer'], organizerSession],
    ] as const;
    for (const [queryKey, data] of preservedEntries)
      client.setQueryData(queryKey, data);
    await renderManage();
    expect(listAttendees).not.toHaveBeenCalled();
    expect(listCoupons).not.toHaveBeenCalled();

    // Force real in-flight refetches over fresh cached host data. The external
    // service promises deliberately ignore abort, as the current API does.
    const pendingDetail = deferred<Awaited<ReturnType<typeof getEvent>>>();
    const pendingAttendees =
      deferred<Awaited<ReturnType<typeof listAttendees>>>();
    const pendingCoupons = deferred<Awaited<ReturnType<typeof listCoupons>>>();
    const pendingOtherDetail = deferred<Awaited<ReturnType<typeof getEvent>>>();
    vi.mocked(getEvent).mockReturnValueOnce(pendingDetail.promise);
    vi.mocked(getEvent).mockReturnValueOnce(pendingOtherDetail.promise);
    vi.mocked(listAttendees).mockReturnValueOnce(pendingAttendees.promise);
    vi.mocked(listCoupons).mockReturnValueOnce(pendingCoupons.promise);
    const reads = [
      [detailKey, () => getEvent(event.slug)],
      [attendeeKey, () => listAttendees(event.slug, { limit: 50, offset: 0 })],
      [couponKey, () => listCoupons(event.slug)],
    ] as const;
    const signals: AbortSignal[] = [];
    let otherSignal: AbortSignal | undefined;
    let pendingReads: Promise<unknown>[] = [];
    act(() => {
      pendingReads = reads.map(([queryKey, read]) =>
        client
          .fetchQuery<unknown>({
            queryKey,
            staleTime: 0,
            queryFn: ({ signal }) => {
              signals.push(signal);
              return read();
            },
          })
          .catch((error) => error)
      );
      pendingReads.push(
        client
          .fetchQuery({
            queryKey: queryKeys.events.detail(otherEvent.slug),
            staleTime: 0,
            queryFn: ({ signal }) => {
              otherSignal = signal;
              return getEvent(otherEvent.slug);
            },
          })
          .catch((error) => error)
      );
    });
    expect(signals).toHaveLength(3);
    expect(signals.every((signal) => !signal.aborted)).toBe(true);
    for (const [queryKey, data] of hostEntries)
      expect(client.getQueryData(queryKey)).toEqual(data);

    let cacheAtNavigation: unknown[] = [];
    let canceledAtNavigation: boolean[] = [];
    let otherCanceledAtNavigation: boolean | undefined;
    replace.mockImplementation(() => {
      cacheAtNavigation = hostEntries.map(([queryKey]) =>
        client.getQueryData(queryKey)
      );
      canceledAtNavigation = signals.map((signal) => signal.aborted);
      otherCanceledAtNavigation = otherSignal?.aborted;
    });
    const user = userEvent.setup();
    await user.click(
      row('viewer').getByRole('button', { name: 'Leave co-host' })
    );
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Leave co-host',
      })
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/events'));
    expect(cacheAtNavigation).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
    expect(canceledAtNavigation).toEqual([true, true, true]);
    expect(otherCanceledAtNavigation).toBe(false);
    expect(
      client.getQueryState(queryKeys.events.detail(otherEvent.slug))
        ?.fetchStatus
    ).toBe('fetching');
    expect(getEvent).toHaveBeenCalledTimes(2);
    expect(listAttendees).toHaveBeenCalledTimes(1);
    expect(listCoupons).toHaveBeenCalledTimes(1);
    for (const [queryKey, data] of preservedEntries) {
      expect(client.getQueryData(queryKey)).toEqual(data);
      expect(client.getQueryState(queryKey)?.isInvalidated).toBe(false);
    }

    await act(async () => {
      pendingDetail.resolve(hostDetail);
      pendingAttendees.resolve(attendees);
      pendingCoupons.resolve(coupons);
      pendingOtherDetail.resolve({ event: otherEvent });
      await Promise.all(pendingReads);
    });
    // Late service responses must not repopulate the revoked host cache.
    for (const [queryKey] of hostEntries)
      expect(client.getQueryState(queryKey)).toBeUndefined();
    expect(
      client.getQueryData(queryKeys.events.detail(otherEvent.slug))
    ).toEqual({ event: otherEvent });
    expect(removeCoHost).toHaveBeenCalledWith(event.slug, 'viewer');
  });

  it('preserves the organizer session and cached host detail when removing another co-host', async () => {
    const hostDetail = { event };
    client.setQueryData(queryKeys.events.detail(event.slug), hostDetail);
    await renderManage('organizer');
    const user = userEvent.setup();
    await user.click(row('viewer').getByRole('button', { name: 'Remove' }));
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Remove co-host',
      })
    );
    expect(await screen.findByText('Co-host removed')).toBeTruthy();
    expect(client.getQueryData(queryKeys.events.detail(event.slug))).toEqual(
      hostDetail
    );
    expect(screen.getByRole('button', { name: 'Delete' })).toBeTruthy();
    expect(replace).not.toHaveBeenCalled();
  });

  it('labels self as Leave co-host while allowing a co-host to remove others', async () => {
    await renderManage();
    expect(
      row('viewer').getByRole('button', { name: 'Leave co-host' })
    ).toBeTruthy();
    expect(
      row('another_host').getByRole('button', { name: 'Remove' })
    ).toBeTruthy();
  });

  it('never offers removal of the organizer even if included in the co-host list', async () => {
    await renderManage('organizer', {
      ...event,
      co_host_usernames: ['organizer', 'another_host'],
    });
    expect(row('organizer').queryByRole('button')).toBeNull();
    expect(
      row('another_host').getByRole('button', { name: 'Remove' })
    ).toBeTruthy();
  });

  it('resets the captured form after an asynchronous add and refreshes the roster', async () => {
    const pending = deferred();
    vi.mocked(addCoHost).mockReturnValueOnce(pending.promise);
    await renderManage();
    enterUsername('  new_host  ');
    fireEvent.submit(addForm());
    expect(addCoHost).toHaveBeenCalledWith('local-cohosts', 'new_host');
    await act(async () => {
      pending.resolve({});
    });
    await waitFor(() =>
      expect(screen.getByPlaceholderText('username')).toHaveProperty(
        'value',
        ''
      )
    );
    expect(await screen.findByText('Co-host added')).toBeTruthy();
    expect(vi.mocked(listAttendees).mock.calls.length).toBeGreaterThan(1);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('blocks duplicate submits and other mutations while an add is pending', async () => {
    const pending = deferred();
    vi.mocked(addCoHost).mockReturnValueOnce(pending.promise);
    await renderManage();
    enterUsername('new_host');
    const form = addForm();
    act(() => {
      fireEvent.submit(form);
      fireEvent.submit(form);
    });
    expect(addCoHost).toHaveBeenCalledTimes(1);
    expect(
      row('another_host')
        .getByRole('button', { name: 'Remove' })
        .hasAttribute('disabled')
    ).toBe(true);
    expect(
      screen.getByPlaceholderText('username').hasAttribute('disabled')
    ).toBe(true);
    await act(async () => {
      pending.resolve({});
    });
    expect(await screen.findByText('Co-host added')).toBeTruthy();
  });

  it('ignores whitespace usernames and lets a failed add be retried without losing input', async () => {
    await renderManage();
    enterUsername('   ');
    fireEvent.submit(addForm());
    expect(addCoHost).not.toHaveBeenCalled();
    vi.mocked(addCoHost).mockRejectedValueOnce(new Error('local failure'));
    enterUsername('new_host');
    fireEvent.submit(addForm());
    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      expect.stringContaining('Could not add co-host')
    );
    expect(screen.getByPlaceholderText('username')).toHaveProperty(
      'value',
      'new_host'
    );
    expect(listAttendees).toHaveBeenCalledTimes(1);
    fireEvent.submit(addForm());
    expect(await screen.findByText('Co-host added')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(addCoHost).toHaveBeenCalledTimes(2);
  });

  it('requires confirmation and permits cancellation before removing someone else', async () => {
    const user = userEvent.setup();
    await renderManage();
    await user.click(
      row('another_host').getByRole('button', { name: 'Remove' })
    );
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/@another_host/)).toBeTruthy();
    expect(removeCoHost).not.toHaveBeenCalled();
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(removeCoHost).not.toHaveBeenCalled();
  });

  it('removes another co-host once, shows success, and refreshes without navigating', async () => {
    const pending = deferred();
    vi.mocked(removeCoHost).mockReturnValueOnce(pending.promise);
    const user = userEvent.setup();
    await renderManage();
    await user.click(
      row('another_host').getByRole('button', { name: 'Remove' })
    );
    const confirm = within(screen.getByRole('dialog')).getByRole('button', {
      name: 'Remove co-host',
    });
    act(() => {
      fireEvent.click(confirm);
      fireEvent.click(confirm);
    });
    expect(removeCoHost).toHaveBeenCalledTimes(1);
    expect(removeCoHost).toHaveBeenCalledWith('local-cohosts', 'another_host');
    expect(confirm.hasAttribute('disabled')).toBe(true);
    expect(
      within(screen.getByRole('dialog'))
        .getByRole('button', { name: 'Cancel' })
        .hasAttribute('disabled')
    ).toBe(true);
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeTruthy();
    await act(async () => {
      pending.resolve({});
    });
    expect(await screen.findByText('Co-host removed')).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(vi.mocked(listAttendees).mock.calls.length).toBeGreaterThan(1);
    expect(replace).not.toHaveBeenCalled();
  });

  it('keeps a failed removal open for retry without success or refresh', async () => {
    vi.mocked(removeCoHost).mockRejectedValueOnce(new Error('local failure'));
    const user = userEvent.setup();
    await renderManage();
    await user.click(
      row('another_host').getByRole('button', { name: 'Remove' })
    );
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Remove co-host',
      })
    );
    expect(
      await within(screen.getByRole('dialog')).findByRole('alert')
    ).toHaveProperty(
      'textContent',
      expect.stringContaining('Could not remove co-host')
    );
    expect(screen.queryByText('Co-host removed')).toBeNull();
    expect(listAttendees).toHaveBeenCalledTimes(1);
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Remove co-host',
      })
    );
    expect(await screen.findByText('Co-host removed')).toBeTruthy();
    expect(removeCoHost).toHaveBeenCalledTimes(2);
  });

  it('confirms self-leave and navigates to events before any privileged refresh', async () => {
    const user = userEvent.setup();
    await renderManage();
    await user.click(
      row('viewer').getByRole('button', { name: 'Leave co-host' })
    );
    expect(screen.getByRole('dialog')).toHaveProperty(
      'textContent',
      expect.stringContaining('manage')
    );
    expect(removeCoHost).not.toHaveBeenCalled();
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' })
    );
    expect(removeCoHost).not.toHaveBeenCalled();
    await user.click(
      row('viewer').getByRole('button', { name: 'Leave co-host' })
    );
    replace.mockImplementation(() => {
      expect(listAttendees).toHaveBeenCalledTimes(1);
      expect(listCoupons).toHaveBeenCalledTimes(1);
    });
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Leave co-host',
      })
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/events'));
    expect(removeCoHost).toHaveBeenCalledWith('local-cohosts', 'viewer');
    expect(await screen.findByText('You left as a co-host')).toBeTruthy();
    expect(listAttendees).toHaveBeenCalledTimes(1);
    expect(listCoupons).toHaveBeenCalledTimes(1);
  });

  it('does not navigate after failed self-leave and allows retry', async () => {
    vi.mocked(removeCoHost).mockRejectedValueOnce(new Error('local failure'));
    const user = userEvent.setup();
    await renderManage();
    await user.click(
      row('viewer').getByRole('button', { name: 'Leave co-host' })
    );
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Leave co-host',
      })
    );
    expect(
      await within(screen.getByRole('dialog')).findByRole('alert')
    ).toHaveProperty('textContent', expect.stringContaining('Could not leave'));
    expect(replace).not.toHaveBeenCalled();
    expect(listAttendees).toHaveBeenCalledTimes(1);
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Leave co-host',
      })
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/events'));
  });
});
