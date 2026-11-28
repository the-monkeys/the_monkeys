import type { ReactNode } from 'react';

import { queryKeys } from '@/lib/queryKeys';
import { authFetcherV2, fetcherV2 } from '@/services/fetcher';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

import useArticle from './useGetPublishedBlogDetailByBlogId';

vi.mock('@/services/fetcher', () => ({
  authFetcherV2: vi.fn().mockResolvedValue({
    blog_id: '123',
    blog: {
      blocks: [{ type: 'paragraph', data: { text: 'Adult revealed article' } }],
    },
    content_rating: { is_nsfw: true, revealed: true },
  }),
  fetcherV2: vi.fn().mockResolvedValue({
    blog_id: '123',
    blog: { blocks: [] },
    content_rating: { is_nsfw: true, revealed: false },
  }),
}));
it('refreshes a redacted SSR DTO through the authenticated read after reveal invalidation', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  client.setQueryData(queryKeys.blog.detail('123'), {
    blog_id: '123',
    blog: { blocks: [] },
    content_rating: { is_nsfw: true, revealed: false },
  });
  const { result, unmount } = renderHook(() => useArticle('123'), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
  await client.invalidateQueries({ queryKey: queryKeys.blog.detail('123') });
  await waitFor(() =>
    expect(result.current.blog?.content_rating?.revealed).toBe(true)
  );
  expect(authFetcherV2).toHaveBeenCalledWith('/blog/123');
  expect(fetcherV2).not.toHaveBeenCalled();
  unmount();
  client.clear();
});
