import { authenticatedArticleImageUrl } from '@/lib/articleMedia';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({
  API_URL: 'https://backend.test/api/v1',
  API_URL_V2: 'https://backend.test/api/v2',
  LIVE_URL: '',
}));
vi.mock('@/lib/seo', () => ({ SITE_URL: 'https://monkeys.com.co' }));

describe('revealed first-party image aliases', () => {
  it('maps all historical storage prefixes to the existing authenticated v2 proxy', () => {
    for (const path of [
      '/api/v1/storage/posts/post/a.png',
      '/api/storage/posts/post/a.png',
      '/storage/posts/post/a.png',
      '/api/v2/storage/posts/post/a.png',
    ]) {
      expect(authenticatedArticleImageUrl('https://backend.test' + path)).toBe(
        '/api/v2/storage/posts/post/a.png'
      );
    }
  });
  it('keeps unrelated third-party URLs unchanged', () =>
    expect(
      authenticatedArticleImageUrl(
        'https://external.test/api/v1/storage/posts/post/a.png'
      )
    ).toBe('https://external.test/api/v1/storage/posts/post/a.png'));
});
