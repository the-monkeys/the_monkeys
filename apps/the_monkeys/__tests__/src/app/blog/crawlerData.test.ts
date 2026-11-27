// @vitest-environment node
import { headers } from 'next/headers';

import { loadCrawlerBlogForSeo } from '@/app/blog/[slug]/blogData';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/constants/api', () => ({
  API_URL: 'https://api.example.test/api/v1',
  API_URL_V2: 'https://api.example.test/api/v2',
}));
vi.mock('next/headers', () => ({ headers: vi.fn(), cookies: vi.fn() }));
const source = {
  blog_id: 'restricted',
  audience: 'public',
  is_draft: false,
  is_nsfw: true,
  seo_indexable: true,
  seo_crawler: true,
  published_time: '2026-01-01T00:00:00Z',
  blog: {
    blocks: [{ type: 'paragraph', data: { text: 'protected original' } }],
  },
};
describe('crawler-only loader', () => {
  beforeEach(() => {
    vi.stubEnv('NSFW_SEO_ENABLED', '1');
    vi.stubEnv(
      'SEO_CRAWLER_SIGNING_KEY',
      'test-only-crawler-signing-key-123456789'
    );
    vi.stubEnv(
      'SEO_CRAWLER_INGRESS_SECRET',
      'independent-test-ingress-secret-123456'
    );
    vi.mocked(headers).mockReturnValue(
      new Headers({
        'user-agent': 'Googlebot/2.1',
        'x-monkeys-client-ip': '66.249.66.1',
        'x-monkeys-ingress-proof': 'independent-test-ingress-secret-123456',
        accept: 'text/html',
        'x-monkeys-crawler-request-kind': 'document',
      }) as never
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });
  it('requires backend confirmation and uses a non-cached credential-free request', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => source });
    vi.stubGlobal('fetch', fetcher);
    expect(await loadCrawlerBlogForSeo('restricted')).toEqual(source);
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toBe('https://api.example.test/api/v2/blog/restricted');
    expect(options.cache).toBe('no-store');
    expect(options.headers.Authorization).toBeUndefined();
    expect(options.headers.Cookie).toBeUndefined();
    expect(options.headers['X-Monkeys-Crawler-Proof']).toMatch(
      /^[a-f0-9]{64}$/
    );
  });
  it.each([
    { ...source, seo_crawler: undefined },
    { ...source, seo_indexable: undefined },
    { ...source, audience: 'group_only' },
    { ...source, is_draft: true },
    { ...source, blog_id: 'different' },
  ])('fails closed for old backend or ineligible content', async (value) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => value })
    );
    expect(await loadCrawlerBlogForSeo('restricted')).toBeNull();
  });
  it('does not make crawler requests for an ordinary visitor', async () => {
    vi.mocked(headers).mockReturnValue(
      new Headers({
        'user-agent': 'Googlebot/2.1',
        'x-forwarded-for': '66.249.66.1',
      }) as never
    );
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    expect(await loadCrawlerBlogForSeo('restricted')).toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
  });
});
