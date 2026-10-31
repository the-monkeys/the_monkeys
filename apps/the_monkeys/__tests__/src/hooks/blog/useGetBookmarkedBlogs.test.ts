import axios from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { authFetcherV2 } from '@/services/fetcher';
import { fetchBookmarkedBlogs } from '@/hooks/blog/useGetBookmarkedBlogs';

vi.mock('@/services/fetcher', () => ({
  authFetcherV2: vi.fn(),
}));

const mockedAuthFetcher = vi.mocked(authFetcherV2);

describe('fetchBookmarkedBlogs', () => {
  afterEach(() => vi.resetAllMocks());

  it('returns an empty page for the endpoint’s no-bookmarks 404', async () => {
    mockedAuthFetcher.mockRejectedValue(
      Object.assign(new Error('Not found'), {
        isAxiosError: true,
        response: { status: 404 },
      })
    );

    await expect(fetchBookmarkedBlogs(10, 0)).resolves.toEqual({
      blogs: [],
      total_blogs: 0,
    });
    expect(mockedAuthFetcher).toHaveBeenCalledWith(
      'blog/in-my-bookmark?limit=10&offset=0'
    );
  });

  it('propagates non-404 responses', async () => {
    const error = new axios.AxiosError('Unauthorized');
    Object.defineProperty(error, 'response', { value: { status: 401 } });
    mockedAuthFetcher.mockRejectedValue(error);

    await expect(fetchBookmarkedBlogs(10, 0)).rejects.toBe(error);
  });

  it('returns the API page when bookmarks exist', async () => {
    const page = { blogs: [], total_blogs: 3 };
    mockedAuthFetcher.mockResolvedValue(page);

    await expect(fetchBookmarkedBlogs(10, 0)).resolves.toBe(page);
  });
});
