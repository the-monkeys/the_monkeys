import { cookies } from 'next/headers';

import {
  loadBlogForViewer,
  loadPublicAuthorForSeo,
  loadPublicBlogForSeo,
} from '@/app/blog/[slug]/blogData';
import { Blog } from '@/services/blog/blogTypes';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({
  API_URL: 'https://api.example.test',
  API_URL_V2: 'https://api.example.test/v2',
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

const blog: Blog = {
  blog_id: '123',
  owner_account_id: 'author-1',
  blog: { time: 1, blocks: [] },
  is_draft: false,
  published_time: '2026-09-19T10:00:00.000Z',
  tags: [],
  LikeCount: 0,
  like_count: 0,
  BookmarkCount: 0,
  bookmark_count: 0,
};

const mockedCookies = vi.mocked(cookies);

describe('public post SEO loaders', () => {
  beforeEach(() => vi.clearAllMocks());

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    ['post', loadPublicBlogForSeo],
    ['author', loadPublicAuthorForSeo],
  ] as const)(
    'distinguishes missing %s data from upstream failure',
    async (_, loader) => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);

      fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
      await expect(loader('id')).resolves.toBeUndefined();

      fetchMock.mockResolvedValueOnce({ ok: false, status: 404 });
      await expect(loader('missing')).resolves.toBeNull();
    }
  );

  it('forwards the member cookie without shared caching', async () => {
    mockedCookies.mockReturnValue({
      get: vi.fn().mockReturnValue({ value: 'member-token' }),
    } as never);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => blog,
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(loadBlogForViewer('123')).resolves.toEqual(blog);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/v2/blog/123',
      {
        cache: 'no-store',
        headers: {
          Authorization: 'Bearer member-token',
          'Content-Type': 'application/json',
        },
      }
    );
  });

  it('supports anonymous reads without an Authorization header', async () => {
    mockedCookies.mockReturnValue({
      get: vi.fn().mockReturnValue(undefined),
    } as never);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ...blog, blog_id: 'anonymous' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await loadBlogForViewer('anonymous');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/v2/blog/anonymous',
      {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  });

  it('distinguishes a denied or missing article from upstream failure', async () => {
    mockedCookies.mockReturnValue({
      get: vi.fn().mockReturnValue(undefined),
    } as never);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    fetchMock.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(loadBlogForViewer('hidden')).resolves.toBeNull();

    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(loadBlogForViewer('failed')).resolves.toBeUndefined();
  });
});
