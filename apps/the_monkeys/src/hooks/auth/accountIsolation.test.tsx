import type { PropsWithChildren } from 'react';

import { useGetFollowers } from '@/hooks/user/useUserConnections';
import { replaceAuthSession } from '@/lib/authQuerySession';
import { queryKeys } from '@/lib/queryKeys';
import { validateSession } from '@/services/auth/auth';
import { authFetcher } from '@/services/fetcher';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import useAuth from './useAuth';

vi.mock('@/services/auth/auth', () => ({ validateSession: vi.fn() }));
vi.mock('@/services/fetcher', () => ({ authFetcher: vi.fn() }));
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
const a = { account_id: 'a', username: 'alice', email: 'a@example.test' };
const b = { account_id: 'b', username: 'bob', email: 'b@example.test' };
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
it('updates mounted followers and auth gates during A/logout/B', async () => {
  const { qc, wrapper } = setup();
  vi.mocked(authFetcher)
    .mockResolvedValueOnce({ followers: ['A private'] })
    .mockResolvedValueOnce({ followers: ['B private'] });
  const { result } = renderHook(
    () => ({ auth: useAuth(), followers: useGetFollowers() }),
    { wrapper }
  );
  await waitFor(() =>
    expect(result.current.followers.followers).toEqual({
      followers: ['A private'],
    })
  );
  await act(async () => {
    await replaceAuthSession(qc, null);
  });
  await waitFor(() => {
    expect(result.current.auth.data).toBeUndefined();
    expect(qc.getQueryData(queryKeys.auth.session())).toBeNull();
    expect(result.current.auth.isSuccess).toBe(false);
    expect(result.current.auth.status).toBe('success');
    expect(result.current.followers.followers).toBeUndefined();
  });
  expect(authFetcher).toHaveBeenCalledTimes(1);
  await act(async () => {
    await replaceAuthSession(qc, b);
  });
  await waitFor(() =>
    expect(result.current.followers.followers).toEqual({
      followers: ['B private'],
    })
  );
  expect(qc.getQueryData(queryKeys.profile.followers('a'))).toBeUndefined();
  qc.clear();
});
it('cancels late private responses and resets mounted legacy data', async () => {
  const { qc, wrapper } = setup();
  let resolve!: (value: string) => void;
  const late = new Promise<string>((r) => {
    resolve = r;
  });
  qc.setQueryData(['legacy-private'], 'A private');
  const { result } = renderHook(
    () => ({
      auth: useAuth(),
      private: useQuery({
        queryKey: ['legacy-private'],
        queryFn: () => late,
        enabled: !!useAuth().data,
        staleTime: 0,
      }),
    }),
    { wrapper }
  );
  await waitFor(() => expect(result.current.private.isFetching).toBe(true));
  await act(async () => {
    await replaceAuthSession(qc, null);
  });
  await act(async () => {
    resolve('late A');
    await late;
  });
  await waitFor(() => expect(result.current.private.data).toBeUndefined());
  expect(result.current.auth.isSuccess).toBe(false);
  expect(qc.getQueryData(['legacy-private'])).toBeUndefined();
  qc.clear();
});
it('clears prior identity when session refresh finds another account', async () => {
  const { qc, wrapper } = setup();
  qc.setQueryData(queryKeys.events.detail('event', 'a'), {
    privateMeeting: 'A',
  });
  qc.setQueryData(queryKeys.groups.detail('group', 'a'), {
    permissions: 'owner',
  });
  vi.mocked(validateSession).mockResolvedValue(b);
  const { result } = renderHook(() => useAuth(), { wrapper });
  expect(result.current.data).toEqual(a);
  await act(async () => {
    await result.current.refetch();
  });
  await waitFor(() => expect(result.current.data?.account_id).toBe('b'));
  expect(
    qc.getQueryData(queryKeys.events.detail('event', 'a'))
  ).toBeUndefined();
  expect(
    qc.getQueryData(queryKeys.groups.detail('group', 'a'))
  ).toBeUndefined();
  qc.clear();
});

it('clears expired-session data and keeps anonymous authentication gates false', async () => {
  const { qc, wrapper } = setup();
  qc.setQueryData(queryKeys.profile.topics('a'), { secret: 'A topics' });
  vi.mocked(validateSession).mockRejectedValue({
    isAxiosError: true,
    response: { status: 401 },
  });
  const { result } = renderHook(() => useAuth(), { wrapper });
  expect(result.current.data).toEqual(a);
  await act(async () => {
    await result.current.refetch();
  });
  await waitFor(() => expect(result.current.data).toBeUndefined());
  expect(result.current.isSuccess).toBe(false);
  expect(result.current.isError).toBe(true);
  expect(qc.getQueryData(queryKeys.profile.topics('a'))).toBeUndefined();
  qc.clear();
});
it('ignores a cancelled old session response without clearing the new account cache', async () => {
  const { qc, wrapper } = setup();
  let resolve!: (user: typeof a) => void;
  const pending = new Promise<typeof a>((r) => {
    resolve = r;
  });
  vi.mocked(validateSession).mockReturnValue(pending);
  const { result } = renderHook(() => useAuth(), { wrapper });
  expect(result.current.data).toEqual(a);
  let refresh!: ReturnType<typeof result.current.refetch>;
  act(() => {
    refresh = result.current.refetch();
  });
  await waitFor(() => expect(validateSession).toHaveBeenCalledTimes(1));
  await act(async () => {
    await replaceAuthSession(qc, b);
  });
  qc.setQueryData(queryKeys.profile.topics('b'), { topics: ['B'] });
  await act(async () => {
    resolve(a);
    await refresh;
    await pending;
  });
  expect(qc.getQueryData(queryKeys.auth.session())).toEqual(b);
  expect(qc.getQueryData(queryKeys.profile.topics('b'))).toEqual({
    topics: ['B'],
  });
  qc.clear();
});
it('keeps content caches when a routine session refresh confirms the same account', async () => {
  const { qc, wrapper } = setup();
  const homepage = ['homepage-public-fixture'];
  qc.setQueryData(homepage, { blogs: ['public'] });
  vi.mocked(validateSession).mockResolvedValue({ ...a, first_name: 'Updated' });
  const { result } = renderHook(() => useAuth(), { wrapper });
  expect(result.current.data).toEqual(a);
  await act(async () => {
    await result.current.refetch();
  });
  await waitFor(() => expect(result.current.data?.first_name).toBe('Updated'));
  expect(qc.getQueryData(homepage)).toEqual({ blogs: ['public'] });
  qc.clear();
});
