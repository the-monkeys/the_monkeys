import type { PropsWithChildren } from 'react';

import { homepageBlogQuery } from '@/services/blog/homepageApi';
import { fetcherV2 } from '@/services/fetcher';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import useGetHomepageBlogs from './useGetHomepageBlogs';

vi.mock('@/services/fetcher', () => ({ fetcherV2: vi.fn() }));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const response = (revealed: boolean) => ({
  homepage_policy_version: 'homepage-v1',
  has_more: false,
  blogs: [
    {
      blog_id: 'post',
      title: revealed ? 'Authorised article' : 'Sensitive content',
      is_nsfw: true,
      content_rating: { is_nsfw: true, revision: 1, revealed },
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
});
it('retains public hydration while waiting for identity without starting a redundant request', () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  client.setQueryData(homepageBlogQuery().queryKey, response(false));
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(
    () => useGetHomepageBlogs({}, { enabled: false }),
    { wrapper }
  );
  expect(result.current.blogs?.blogs[0].title).toBe('Sensitive content');
  expect(fetcherV2).not.toHaveBeenCalled();
  client.clear();
});
it('loads a signed-in homepage once without writing revealed content into public hydration', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const publicKey = homepageBlogQuery().queryKey;
  client.setQueryData(publicKey, response(false));
  vi.mocked(fetcherV2).mockResolvedValue(response(true));
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(
    () => useGetHomepageBlogs({}, { viewer: 'adult' }),
    { wrapper }
  );
  await waitFor(() =>
    expect(result.current.blogs?.blogs[0].title).toBe('Authorised article')
  );
  expect(client.getQueryData(publicKey)).toEqual(response(false));
  expect(fetcherV2).toHaveBeenCalledTimes(1);
  client.clear();
});
