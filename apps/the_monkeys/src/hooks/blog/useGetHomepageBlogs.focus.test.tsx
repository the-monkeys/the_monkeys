import type { PropsWithChildren } from 'react';

import useGetHomepageBlogs from '@/hooks/blog/useGetHomepageBlogs';
import { homepageBlogQuery } from '@/services/blog/homepageApi';
import { fetcherV2 } from '@/services/fetcher';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('@/services/fetcher', () => ({ fetcherV2: vi.fn() }));
let client: QueryClient;
afterEach(() => {
  cleanup();
  client?.clear();
  focusManager.setFocused(undefined);
  onlineManager.setOnline(true);
  vi.resetAllMocks();
});

it.each(['latest', 'trending'] as const)(
  'keeps validated %s articles visible during stale focus revalidation',
  async (sort) => {
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const response = {
      blogs: [
        {
          blog_id: 'public-article',
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
      has_more: false,
      homepage_policy_version: 'homepage-v1',
    };
    vi.mocked(fetcherV2).mockResolvedValueOnce(response);
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useGetHomepageBlogs({ sort }), {
      wrapper,
    });
    await waitFor(() =>
      expect(result.current.blogs?.blogs[0]?.blog_id).toBe('public-article')
    );
    let resolve!: (value: unknown) => void;
    vi.mocked(fetcherV2).mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        })
    );
    await act(async () => {
      focusManager.setFocused(false);
      client.setQueryData(homepageBlogQuery({ sort }).queryKey, response, {
        updatedAt: 1,
      });
      focusManager.setFocused(true);
    });
    await waitFor(() => expect(fetcherV2).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(
        client.getQueryState(homepageBlogQuery({ sort }).queryKey)?.fetchStatus
      ).toBe('fetching')
    );
    try {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.blogs?.blogs[0]?.blog_id).toBe('public-article');
    } finally {
      await act(async () => {
        resolve(response);
      });
    }
  }
);
it('does not request the same freshly validated homepage again on rapid tab returns', async () => {
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const response = {
    blogs: [],
    has_more: false,
    homepage_policy_version: 'homepage-v1',
  };
  vi.mocked(fetcherV2).mockResolvedValue(response);
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(() => useGetHomepageBlogs(), { wrapper });
  await waitFor(() => expect(result.current.blogs?.blogs).toEqual([]));
  await act(async () => {
    focusManager.setFocused(false);
    focusManager.setFocused(true);
    await Promise.resolve();
  });
  expect(fetcherV2).toHaveBeenCalledTimes(1);
});

const assessedHomepageResponse = {
  blogs: [
    {
      blog_id: 'formerly-public',
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
  has_more: false,
  homepage_policy_version: 'homepage-v1',
};

it('hides invalidated articles when an explicit write interrupts a routine refetch', async () => {
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const key = homepageBlogQuery().queryKey;
  client.setQueryData(key, assessedHomepageResponse);
  vi.mocked(fetcherV2).mockImplementation(() => new Promise(() => {}));
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(() => useGetHomepageBlogs(), { wrapper });
  await waitFor(() =>
    expect(client.getQueryState(key)?.fetchStatus).toBe('fetching')
  );
  expect(result.current.blogs?.blogs[0]?.blog_id).toBe('formerly-public');

  // A withdrawal/restriction write must hide the article even though the
  // replacement request leaves isFetching unchanged throughout invalidation.
  act(() => {
    void client.invalidateQueries({ queryKey: key });
  });
  expect(client.getQueryState(key)?.isInvalidated).toBe(true);
  await waitFor(
    () => {
      expect(result.current.blogs).toBeUndefined();
      expect(result.current.isLoading).toBe(true);
    },
    { timeout: 250 }
  );
});

it('hides invalidated articles while their offline recheck is paused', async () => {
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const key = homepageBlogQuery().queryKey;
  client.setQueryData(key, assessedHomepageResponse);
  onlineManager.setOnline(false);
  vi.mocked(fetcherV2).mockImplementation(() => new Promise(() => {}));
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(() => useGetHomepageBlogs(), { wrapper });
  expect(result.current.blogs?.blogs[0]?.blog_id).toBe('formerly-public');

  act(() => {
    void client.invalidateQueries({ queryKey: key });
  });
  expect(client.getQueryState(key)?.isInvalidated).toBe(true);
  expect(client.getQueryState(key)?.fetchStatus).toBe('paused');
  await waitFor(
    () => {
      expect(result.current.blogs).toBeUndefined();
      expect(result.current.isLoading).toBe(true);
    },
    { timeout: 250 }
  );
});
