import { GET } from '@/app/posts/feed.xml/route';
import { fetchRecentPublicPosts } from '@/lib/seoCatalog';
import type { MetaBlog } from '@/services/blog/blogTypes';
import { expect, it, vi } from 'vitest';

vi.mock('@/lib/seoCatalog', () => ({ fetchRecentPublicPosts: vi.fn() }));
it('keeps a pinned legacy RSS identity after a Hindi headline edit', async () => {
  vi.mocked(fetchRecentPublicPosts).mockResolvedValue([
    {
      blog_id: '123',
      title: 'नया शीर्षक',
      canonical_slug: 'नमस्ते-original-123',
      rss_guid: 'https://monkeys.com.co/blog/original-123',
      tags: [],
      owner_account_id: 'author',
      published_time: '2025-01-01',
      first_image: '',
      first_paragraph: 'Description',
    } as MetaBlog,
  ]);
  const xml = await (await GET()).text();
  expect(xml).toContain(
    '<guid isPermaLink="true">https://monkeys.com.co/blog/original-123</guid>'
  );
  expect(xml).toContain(
    '/blog/' + encodeURIComponent('नमस्ते-original') + '-123</link>'
  );
});
it.each([
  'https://evil.test/blog/original-123',
  'https://monkeys.com.co/blog/original-other',
  'https://monkeys.com.co/blog/one%2Ftwo-123',
])('rejects unsafe pinned RSS identity %s', async (rss_guid) => {
  vi.mocked(fetchRecentPublicPosts).mockResolvedValue([
    {
      blog_id: '123',
      title: 'Legacy',
      rss_guid,
      tags: [],
      owner_account_id: 'author',
      published_time: '2025-01-01',
      first_image: '',
      first_paragraph: '',
    } as MetaBlog,
  ]);
  expect(await (await GET()).text()).toContain(
    '<guid isPermaLink="true">https://monkeys.com.co/blog/legacy-123</guid>'
  );
});
