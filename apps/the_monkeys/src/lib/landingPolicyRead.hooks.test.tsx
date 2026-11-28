import type { PropsWithChildren } from 'react';

import useGetHomepageBlogs from '@/hooks/blog/useGetHomepageBlogs';
import { useEventList } from '@/hooks/events/useEventQueries';
import { useLandingCommunity } from '@/hooks/landing/useLandingCommunity';
import { queryKeys } from '@/lib/queryKeys';
import { homepageBlogQuery } from '@/services/blog/homepageApi';
import { listEvents } from '@/services/events/eventsApi';
import { fetcherV2 } from '@/services/fetcher';
import {
  readLandingDiscussions,
  readLandingGroups,
} from '@/services/landing/communityApi';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('@/services/fetcher', () => ({
  fetcherV2: vi.fn(),
  fetcher: vi.fn(),
  authFetcher: vi.fn(),
}));
vi.mock('@/services/landing/communityApi', async (original) => ({
  ...(await original<typeof import('@/services/landing/communityApi')>()),
  readLandingDiscussions: vi.fn(),
  readLandingGroups: vi.fn(),
}));
vi.mock('@/services/events/eventsApi', async (original) => ({
  ...(await original<typeof import('@/services/events/eventsApi')>()),
  listEvents: vi.fn(),
}));
const clients: QueryClient[] = [];
afterEach(() => {
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
  focusManager.setFocused(undefined);
  onlineManager.setOnline(true);
  vi.resetAllMocks();
});
function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  clients.push(client);
  client.setQueryData(queryKeys.auth.session(), {
    account_id: 'a',
    username: 'alice',
  });
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}
function homepage(revealed = true) {
  return {
    homepage_policy_version: 'homepage-v1',
    has_more: false,
    blogs: [
      {
        blog_id: 'post',
        title: revealed ? 'Private article' : 'Sensitive content',
        is_nsfw: true,
        content_rating: {
          target: { kind: 'blog', id: 'post' },
          is_nsfw: true,
          revision: 1,
          revealed,
        },
        homepage_eligibility: {
          eligible: true,
          lead_eligible: true,
          word_count: 250,
          minimum_words: 250,
          reasons: [],
          version: 'homepage-v1',
        },
      },
    ],
  };
}
it('keeps public initial data untrusted until the exact viewer network result is committed', async () => {
  const { client, wrapper } = setup();
  const seed = homepage(false);
  client.setQueryData(homepageBlogQuery().queryKey, seed);
  const network = deferred<ReturnType<typeof homepage>>();
  vi.mocked(fetcherV2).mockReturnValue(network.promise);
  const { result } = renderHook(
    () => useGetHomepageBlogs({}, { viewer: 'a' }),
    { wrapper }
  );
  expect((result.current as any).policySource).toMatchObject({
    viewer: 'a',
    fresh: false,
    pending: true,
    failed: false,
  });
  expect(result.current.blogs).toEqual(seed);
  await act(async () => {
    network.resolve(homepage(false));
  });
  await waitFor(() =>
    expect((result.current as any).policySource.fresh).toBe(true)
  );
  const source = (result.current as any).policySource;
  expect(source.data).toBe(
    client.getQueryData(homepageBlogQuery({}, 'a').queryKey)
  );
  expect(source.data).not.toBe(seed);
  expect(source.items[0]).toBe(source.data.blogs[0]);
  expect(source.data.blogs[0].content_rating).not.toBe(
    seed.blogs[0].content_rating
  );
  expect(client.getQueryData(homepageBlogQuery().queryKey)).toBe(seed);
});
it('rechecks sensitive homepage data on rapid focus and fails closed on an unsuccessful refresh', async () => {
  const { wrapper } = setup();
  vi.mocked(fetcherV2).mockResolvedValueOnce(homepage());
  const { result } = renderHook(
    () => useGetHomepageBlogs({}, { viewer: 'a' }),
    { wrapper }
  );
  await waitFor(() =>
    expect((result.current as any).policySource?.fresh).toBe(true)
  );
  const refresh = deferred<ReturnType<typeof homepage>>();
  vi.mocked(fetcherV2).mockReturnValueOnce(refresh.promise);
  await act(async () => {
    focusManager.setFocused(false);
    focusManager.setFocused(true);
  });
  await waitFor(() => expect(fetcherV2).toHaveBeenCalledTimes(2));
  expect((result.current as any).policySource).toMatchObject({
    fresh: true,
    pending: false,
  });
  await act(async () => {
    refresh.reject(new Error('Policy unavailable'));
  });
  await waitFor(() =>
    expect((result.current as any).policySource).toMatchObject({
      fresh: false,
      pending: false,
      failed: true,
    })
  );
  vi.mocked(fetcherV2).mockResolvedValueOnce(homepage());
  await act(async () => {
    await (result.current as any).policySource.retry();
  });
  await waitFor(() =>
    expect((result.current as any).policySource.fresh).toBe(true)
  );
});
it('rereads once when same-account auth validation advances the receipt epoch', async () => {
  const { client, wrapper } = setup();
  vi.mocked(fetcherV2).mockResolvedValueOnce(homepage());
  const { result } = renderHook(
    () => useGetHomepageBlogs({}, { viewer: 'a' }),
    { wrapper }
  );
  await waitFor(() =>
    expect((result.current as any).policySource?.fresh).toBe(true)
  );
  const refresh = deferred<ReturnType<typeof homepage>>();
  vi.mocked(fetcherV2).mockReturnValueOnce(refresh.promise);
  await act(async () => {
    client.setQueryData(queryKeys.auth.session(), {
      account_id: 'a',
      username: 'alice',
    });
  });
  await waitFor(() => expect(fetcherV2).toHaveBeenCalledTimes(2));
  expect((result.current as any).policySource).toMatchObject({
    fresh: false,
    pending: true,
  });
  await act(async () => {
    refresh.resolve(homepage());
  });
  await waitFor(() =>
    expect((result.current as any).policySource.fresh).toBe(true)
  );
  expect(fetcherV2).toHaveBeenCalledTimes(2);
});
it('does not trust invalidated cached data while its offline recheck is paused', async () => {
  const { client, wrapper } = setup();
  vi.mocked(fetcherV2).mockResolvedValue(homepage());
  const { result } = renderHook(
    () => useGetHomepageBlogs({}, { viewer: 'a' }),
    { wrapper }
  );
  await waitFor(() =>
    expect((result.current as any).policySource?.fresh).toBe(true)
  );
  onlineManager.setOnline(false);
  await act(async () => {
    void client.invalidateQueries({
      queryKey: homepageBlogQuery({}, 'a').queryKey,
    });
  });
  await waitFor(() =>
    expect((result.current as any).policySource).toMatchObject({
      fresh: false,
      pending: true,
      failed: false,
    })
  );
});
it('does not certify a viewer response against another authenticated account', async () => {
  const { wrapper } = setup();
  vi.mocked(fetcherV2).mockResolvedValue(homepage());
  const { result } = renderHook(
    () => useGetHomepageBlogs({}, { viewer: 'b' }),
    { wrapper }
  );
  await waitFor(() =>
    expect((result.current as any).policySource).toMatchObject({
      fresh: false,
      pending: false,
      failed: true,
    })
  );
});
it('certifies the actual selected community arrays and keeps their public seeds separate', async () => {
  const { client, wrapper } = setup();
  const seed: any[] = [{ is_nsfw: true, content_rating: { revealed: false } }];
  client.setQueryData(queryKeys.landing.discussions(), seed);
  client.setQueryData(queryKeys.landing.groups(), seed);
  const discussions: any[] = [
    { is_nsfw: true, content_rating: { revealed: true } },
  ];
  const groups: any[] = [{ is_nsfw: true, content_rating: { revealed: true } }];
  vi.mocked(readLandingDiscussions).mockResolvedValue(discussions);
  vi.mocked(readLandingGroups).mockResolvedValue(groups);
  const { result } = renderHook(() => useLandingCommunity(), { wrapper });
  await waitFor(() =>
    expect((result.current.discussions as any).policySource?.fresh).toBe(true)
  );
  expect((result.current.discussions as any).policySource.data).toBe(
    discussions
  );
  expect((result.current.groups as any).policySource.data).toBe(groups);
  expect((result.current.groups as any).policySource.items).toBe(groups);
  expect(client.getQueryData(queryKeys.landing.groups())).toBe(seed);
});
it('certifies event lists only when the third parameter opts in', async () => {
  const { client, wrapper } = setup();
  const seed: any = {
    events: [{ is_nsfw: true, content_rating: { revealed: false } }],
  };
  client.setQueryData(queryKeys.events.list({ limit: 3 }), seed);
  const response = structuredClone(seed);
  vi.mocked(listEvents).mockResolvedValue(response);
  const { result } = renderHook(() => useEventList({ limit: 3 }, true, true), {
    wrapper,
  });
  await waitFor(() =>
    expect((result.current as any).policySource?.fresh).toBe(true)
  );
  expect(result.current.data).toBe(response);
  expect((result.current as any).policySource.items).toBe(response.events);
  expect(client.getQueryData(queryKeys.events.list({ limit: 3 }))).toBe(seed);
});
it('preserves structural sharing and the ordinary result for event callers without opt-in', async () => {
  const { client, wrapper } = setup();
  const seed: any = {
    events: [{ is_nsfw: true, content_rating: { revealed: false } }],
  };
  client.setQueryData(queryKeys.events.list({ limit: 4 }, 'a'), seed);
  vi.mocked(listEvents).mockResolvedValue(structuredClone(seed));
  const { result } = renderHook(() => useEventList({ limit: 4 }), { wrapper });
  await waitFor(() => expect(result.current.isFetchedAfterMount).toBe(true));
  expect(result.current.data).toBe(seed);
  expect((result.current as any).policySource).toBeUndefined();
});
it('does not recertify a cached response on remount until another network read finishes', async () => {
  const { wrapper } = setup();
  vi.mocked(fetcherV2).mockResolvedValueOnce(homepage());
  const first = renderHook(() => useGetHomepageBlogs({}, { viewer: 'a' }), {
    wrapper,
  });
  await waitFor(() =>
    expect(first.result.current.policySource.fresh).toBe(true)
  );
  first.unmount();
  const refresh = deferred<ReturnType<typeof homepage>>();
  vi.mocked(fetcherV2).mockReturnValueOnce(refresh.promise);
  const second = renderHook(() => useGetHomepageBlogs({}, { viewer: 'a' }), {
    wrapper,
  });
  expect(second.result.current.policySource).toMatchObject({
    fresh: false,
    pending: true,
  });
  await act(async () => {
    refresh.resolve(homepage());
  });
  await waitFor(() =>
    expect(second.result.current.policySource.fresh).toBe(true)
  );
});
it('rereads once against the validated session when validation advances during the initial read', async () => {
  const { client, wrapper } = setup();
  const initial = deferred<ReturnType<typeof homepage>>();
  const current = deferred<ReturnType<typeof homepage>>();
  vi.mocked(fetcherV2)
    .mockReturnValueOnce(initial.promise)
    .mockReturnValueOnce(current.promise);
  const { result } = renderHook(
    () => useGetHomepageBlogs({}, { viewer: 'a' }),
    { wrapper }
  );
  await act(async () => {
    client.setQueryData(queryKeys.auth.session(), {
      account_id: 'a',
      username: 'alice',
    });
    initial.resolve(homepage());
  });
  await waitFor(() => expect(fetcherV2).toHaveBeenCalledTimes(2));
  expect(result.current.policySource).toMatchObject({
    fresh: false,
    pending: true,
    failed: false,
  });
  await act(async () => {
    current.resolve(homepage());
  });
  await waitFor(() =>
    expect(result.current.policySource).toMatchObject({
      fresh: true,
      pending: false,
      failed: false,
    })
  );
  expect(fetcherV2).toHaveBeenCalledTimes(2);
});
it('stops after a failed generation reread without granting old access or retrying forever', async () => {
  const { client, wrapper } = setup();
  const initial = deferred<ReturnType<typeof homepage>>();
  vi.mocked(fetcherV2)
    .mockReturnValueOnce(initial.promise)
    .mockRejectedValueOnce(new Error('Recheck offline'));
  const { result } = renderHook(
    () => useGetHomepageBlogs({}, { viewer: 'a' }),
    { wrapper }
  );
  await act(async () => {
    client.setQueryData(queryKeys.auth.session(), {
      account_id: 'a',
      username: 'alice',
    });
    initial.resolve(homepage());
  });
  await waitFor(() =>
    expect(result.current.policySource).toMatchObject({
      fresh: false,
      pending: false,
      failed: true,
    })
  );
  expect(fetcherV2).toHaveBeenCalledTimes(2);
});
it('never accepts a cancelled initial transport response after the observer unmounts', async () => {
  const { client, wrapper } = setup();
  const initial = deferred<ReturnType<typeof homepage>>();
  vi.mocked(fetcherV2).mockReturnValueOnce(initial.promise);
  const { unmount } = renderHook(
    () => useGetHomepageBlogs({}, { viewer: 'a' }),
    { wrapper }
  );
  await waitFor(() => expect(fetcherV2).toHaveBeenCalledTimes(1));
  unmount();
  await act(async () => {
    initial.resolve(homepage());
    await initial.promise;
  });
  expect(
    client.getQueryData(homepageBlogQuery({}, 'a').queryKey)
  ).toBeUndefined();
});
it('never flashes failed while a stale same-account receipt is being reconciled', async () => {
  const { client, wrapper } = setup();
  const snapshots: { fresh: boolean; pending: boolean; failed: boolean }[] = [];
  vi.mocked(fetcherV2).mockResolvedValueOnce(homepage());
  const { result } = renderHook(
    () => {
      const query = useGetHomepageBlogs({}, { viewer: 'a' });
      snapshots.push(query.policySource);
      return query;
    },
    { wrapper }
  );
  await waitFor(() => expect(result.current.policySource.fresh).toBe(true));
  snapshots.length = 0;
  const refresh = deferred<ReturnType<typeof homepage>>();
  vi.mocked(fetcherV2).mockReturnValueOnce(refresh.promise);
  await act(async () => {
    client.setQueryData(queryKeys.auth.session(), {
      account_id: 'a',
      username: 'alice',
    });
  });
  await waitFor(() => expect(fetcherV2).toHaveBeenCalledTimes(2));
  expect(snapshots.length).toBeGreaterThan(0);
  expect(
    snapshots.every(
      (source) => source.pending && !source.fresh && !source.failed
    )
  ).toBe(true);
  await act(async () => {
    refresh.reject(new Error('Epoch recheck failed'));
  });
  await waitFor(() =>
    expect(result.current.policySource).toMatchObject({
      fresh: false,
      pending: false,
      failed: true,
    })
  );
  expect(fetcherV2).toHaveBeenCalledTimes(2);
});
it('passes the observer AbortSignal to homepage transport and aborts it on unmount', async () => {
  const { wrapper } = setup();
  vi.mocked(fetcherV2).mockReturnValue(new Promise(() => {}));
  const { unmount } = renderHook(
    () => useGetHomepageBlogs({}, { viewer: 'a' }),
    { wrapper }
  );
  await waitFor(() => expect(fetcherV2).toHaveBeenCalledTimes(1));
  const signal = vi.mocked(fetcherV2).mock.calls[0][1];
  expect(signal).toBeInstanceOf(AbortSignal);
  expect(signal?.aborted).toBe(false);
  unmount();
  expect(signal?.aborted).toBe(true);
});
