import {
  loadPublicAuthorForSeo,
  loadPublicBlogForSeo,
} from '@/app/blog/[slug]/blogData';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({
  API_URL: 'https://api.example.test',
  API_URL_V2: 'https://api.example.test/v2',
}));

describe('public post SEO loaders', () => {
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
});
