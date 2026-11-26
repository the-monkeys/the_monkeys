import type { PropsWithChildren } from 'react';

import { homepageBlogQuery } from '@/services/blog/homepageApi';
import { fetcherV2 } from '@/services/fetcher';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import useGetHomepageBlogs from './useGetHomepageBlogs';
import useGetMetaFeedBlogs from './useGetMetaFeedBlogs';
import useGetTrendingBlogs from './useGetTrendingBlogs';

vi.mock('@/services/fetcher', () => ({ fetcherV2: vi.fn() }));
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
const makeWrapper = (client: QueryClient) =>
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
describe('homepage hook and ordinary-feed compatibility', () => {
  it('preserves the ordinary hooks default endpoints, keys and response shapes', async () => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.mocked(fetcherV2).mockResolvedValue({
      blogs: [{ blog_id: 'ordinary' }],
      total_blogs: 1,
    });
    const { result } = renderHook(
      () => ({ meta: useGetMetaFeedBlogs(), trending: useGetTrendingBlogs() }),
      { wrapper: makeWrapper(qc) }
    );
    await waitFor(() =>
      expect(
        result.current.meta.isLoading || result.current.trending.isLoading
      ).toBe(false)
    );
    expect(fetcherV2).toHaveBeenCalledWith('/blog/meta-feed?limit=50');
    expect(fetcherV2).toHaveBeenCalledWith('/blog/trending');
    expect(result.current.meta.blogs?.blogs[0].blog_id).toBe('ordinary');
    expect(result.current.trending.blogs[0].blog_id).toBe('ordinary');
    expect(qc.getQueryData(['meta-feed-blogs', 50])).toBeDefined();
    expect(qc.getQueryData(['trending-blogs'])).toBeDefined();
  });
  it('does not leak ordinary cached posts when the new endpoint is unavailable', async () => {
    const qc = new QueryClient();
    qc.setQueryData(['meta-feed-blogs', 12], {
      blogs: [{ blog_id: 'ordinary' }],
    });
    qc.setQueryData(['trending-blogs'], { blogs: [{ blog_id: 'ordinary' }] });
    vi.mocked(fetcherV2).mockRejectedValue(new Error('Old backend'));
    const { result } = renderHook(() => useGetHomepageBlogs(), {
      wrapper: makeWrapper(qc),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.blogs).toBeUndefined();
    expect(fetcherV2).toHaveBeenCalledTimes(1);
    expect(fetcherV2).toHaveBeenCalledWith(
      '/blog/homepage?limit=12&offset=0&sort=latest'
    );
  });
  it('withholds previously eligible homepage data after a failed freshness check', async () => {
    const qc = new QueryClient();
    qc.setQueryData(homepageBlogQuery().queryKey, {
      blogs: [{ blog_id: 'formerly-public' }],
      has_more: false,
      homepage_policy_version: 'homepage-v1',
    });
    vi.mocked(fetcherV2).mockRejectedValue(new Error('Unavailable'));
    const { result } = renderHook(() => useGetHomepageBlogs(), {
      wrapper: makeWrapper(qc),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.blogs).toBeUndefined();
  });
});

it.each(['latest', 'trending'] as const)(
  'withholds a cached %s lead throughout a deferred background freshness check',
  async (sort) => {
    const qc = new QueryClient();
    const params = { sort };
    const policy = {
      eligible: true,
      lead_eligible: true,
      word_count: 250,
      minimum_words: 250,
      reasons: [],
      version: 'homepage-v1',
    };
    const confirmed = {
      blogs: [{ blog_id: 'formerly-public', homepage_eligibility: policy }],
      has_more: false,
      homepage_policy_version: 'homepage-v1',
    };
    vi.mocked(fetcherV2).mockResolvedValueOnce(confirmed);
    const { result } = renderHook(() => useGetHomepageBlogs(params), {
      wrapper: makeWrapper(qc),
    });
    await waitFor(() =>
      expect(result.current.blogs?.blogs[0].blog_id).toBe('formerly-public')
    );
    let resolve!: (value: unknown) => void;
    vi.mocked(fetcherV2).mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        })
    );
    let refresh!: Promise<void>;
    act(() => {
      refresh = qc.invalidateQueries({
        queryKey: homepageBlogQuery(params).queryKey,
      });
    });
    await waitFor(() =>
      expect(
        qc.getQueryState(homepageBlogQuery(params).queryKey)?.fetchStatus
      ).toBe('fetching')
    );
    await waitFor(() => expect(result.current.isLoading).toBe(true));
    expect(result.current.blogs).toBeUndefined();
    expect(result.current.isError).toBe(false);
    await act(async () => {
      resolve({
        blogs: [],
        has_more: false,
        homepage_policy_version: 'homepage-v1',
      });
      await refresh;
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.blogs?.blogs).toEqual([]);
  }
);

it('keeps a cached homepage article hidden when a deferred refetch returns an old backend response', async () => {
  const qc = new QueryClient();
  qc.setQueryData(homepageBlogQuery().queryKey, {
    blogs: [{ blog_id: 'formerly-public' }],
  });
  let resolve!: (value: unknown) => void;
  vi.mocked(fetcherV2).mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done;
      })
  );
  const { result } = renderHook(() => useGetHomepageBlogs(), {
    wrapper: makeWrapper(qc),
  });
  expect(result.current.isLoading).toBe(true);
  expect(result.current.blogs).toBeUndefined();
  await act(async () => {
    resolve({ blogs: [{ blog_id: 'unfiltered' }] });
  });
  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(result.current.blogs).toBeUndefined();
});
