import type { PropsWithChildren } from 'react';

import useAuth from '@/hooks/auth/useAuth';
import { useEventDetail } from '@/hooks/events/useEventQueries';
import { useGroupDetail, useGroupList } from '@/hooks/groups/useGroupQueries';
import { replaceAuthSession } from '@/lib/authQuerySession';
import { queryKeys } from '@/lib/queryKeys';
import { validateSession } from '@/services/auth/auth';
import { getEvent } from '@/services/events/eventsApi';
import { getGroup, listGroups } from '@/services/groups/groupsApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('@/services/auth/auth', () => ({ validateSession: vi.fn() }));
vi.mock('@/services/events/eventsApi', async (original) => ({
  ...(await original<typeof import('@/services/events/eventsApi')>()),
  getEvent: vi.fn(),
}));
vi.mock('@/services/groups/groupsApi', async (original) => ({
  ...(await original<typeof import('@/services/groups/groupsApi')>()),
  getGroup: vi.fn(),
  listGroups: vi.fn(),
}));
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
const a = { account_id: 'a', username: 'alice', email: 'a@example.test' };
const b = { account_id: 'b', username: 'bob', email: 'b@example.test' };
const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
};
const setup = () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  qc.setQueryData(queryKeys.auth.session(), a);
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return { qc, wrapper };
};
it('shows safe public SSR seeds, reconciles A, and never shows A details to B', async () => {
  const { qc, wrapper } = setup();
  const ea = deferred<any>(),
    eb = deferred<any>(),
    ga = deferred<any>(),
    gb = deferred<any>();
  vi.mocked(getEvent)
    .mockReturnValueOnce(ea.promise)
    .mockReturnValueOnce(eb.promise);
  vi.mocked(getGroup)
    .mockReturnValueOnce(ga.promise)
    .mockReturnValueOnce(gb.promise);
  qc.setQueryData(queryKeys.events.detail('event'), {
    event: { title: 'Public event' },
  });
  qc.setQueryData(queryKeys.groups.detail('group'), {
    group: { name: 'Public group' },
  });
  const { result } = renderHook(
    () => ({ event: useEventDetail('event'), group: useGroupDetail('group') }),
    { wrapper }
  );
  expect(result.current.event.data?.event?.title).toBe('Public event');
  expect(result.current.group.data?.group?.name).toBe('Public group');
  await waitFor(() => expect(getEvent).toHaveBeenCalledTimes(1));
  await act(async () => {
    ea.resolve({ event: { meeting_link: 'A secret' } });
    ga.resolve({ group: { viewer_role: 'owner' } });
  });
  await waitFor(() =>
    expect(result.current.event.data?.event?.meeting_link).toBe('A secret')
  );
  await act(async () => {
    await replaceAuthSession(qc, b);
  });
  await waitFor(() => expect(getEvent).toHaveBeenCalledTimes(2));
  expect(result.current.event.data?.event?.meeting_link).toBeUndefined();
  expect(result.current.group.data?.group?.viewer_role).toBeUndefined();
  await act(async () => {
    eb.resolve({ event: { title: 'B view' } });
    gb.resolve({ group: { viewer_role: 'viewer' } });
  });
  await waitFor(() =>
    expect(result.current.group.data?.group?.viewer_role).toBe('viewer')
  );
  qc.clear();
});
it('does not carry previous group-list permissions over an identity-key change', async () => {
  const { qc, wrapper } = setup();
  const pending = deferred<any>();
  vi.mocked(listGroups)
    .mockResolvedValueOnce({
      groups: [{ name: 'A private', viewer_role: 'owner' }],
    } as any)
    .mockReturnValue(pending.promise);
  const { result, rerender } = renderHook(
    ({ limit }) => useGroupList({ limit }),
    { wrapper, initialProps: { limit: 10 } }
  );
  await waitFor(() =>
    expect(result.current.data?.groups?.[0]?.name).toBe('A private')
  );
  rerender({ limit: 20 });
  expect(result.current.data?.groups?.[0]?.name).toBe('A private');
  await act(async () => {
    qc.setQueryData(queryKeys.auth.session(), b);
  });
  await waitFor(() => expect(result.current.data).toBeUndefined());
  qc.clear();
});
it('ignores an A detail response completed after account switching', async () => {
  const { qc, wrapper } = setup();
  const ea = deferred<any>(),
    eb = deferred<any>();
  vi.mocked(getEvent)
    .mockReturnValueOnce(ea.promise)
    .mockReturnValueOnce(eb.promise);
  const { result } = renderHook(() => useEventDetail('event'), { wrapper });
  await waitFor(() => expect(getEvent).toHaveBeenCalledTimes(1));
  await act(async () => {
    await replaceAuthSession(qc, b);
  });
  await waitFor(() => expect(getEvent).toHaveBeenCalledTimes(2));
  await act(async () => {
    ea.resolve({ event: { meeting_link: 'late A secret' } });
    await ea.promise;
  });
  expect(result.current.data).toBeUndefined();
  expect(
    qc.getQueryData(queryKeys.events.detail('event', 'a'))
  ).toBeUndefined();
  await act(async () => {
    eb.resolve({ event: { title: 'B' } });
  });
  await waitFor(() => expect(result.current.data?.event?.title).toBe('B'));
  qc.clear();
});

it('keeps safe public seeds without fetching viewer data when session validation fails transiently', async () => {
  const { qc, wrapper } = setup();
  qc.removeQueries({ queryKey: queryKeys.auth.session() });
  qc.setQueryData(queryKeys.events.detail('event'), {
    event: { title: 'Public' },
  });
  vi.mocked(validateSession).mockRejectedValue(new Error('Temporary outage'));
  vi.mocked(getEvent).mockReturnValue(new Promise(() => {}));
  const { result } = renderHook(
    () => ({ auth: useAuth(), event: useEventDetail('event') }),
    { wrapper }
  );
  await waitFor(() => expect(result.current.auth.isError).toBe(true));
  expect(result.current.event.data?.event?.title).toBe('Public');
  expect(getEvent).not.toHaveBeenCalled();
  qc.clear();
});
