import { buildMainSitemap } from '@/app/sitemap';
import { MetaBlog } from '@/services/blog/blogTypes';
import { describe, expect, it } from 'vitest';

describe('main sitemap', () => {
  it('contains canonical public pages and posts but not sitemap files', () => {
    const posts: MetaBlog[] = [
      {
        blog_id: '1',
        title: 'Valid Post',
        first_image: '',
        first_paragraph: 'Summary',
        owner_account_id: 'author-1',
        published_time: '2026-09-10T10:00:00.000Z',
        tags: ['AI'],
      },
    ];
    const urls = buildMainSitemap(posts).map((entry) => entry.url);

    expect(urls).toContain('https://monkeys.com.co/');
    expect(urls).toContain('https://monkeys.com.co/topics/explore');
    expect(urls).toContain('https://monkeys.com.co/blog/valid-post-1');
    expect(urls.some((url) => url.endsWith('sitemap.xml'))).toBe(false);
    expect(urls.some((url) => url.includes('unknown'))).toBe(false);
  });
});
