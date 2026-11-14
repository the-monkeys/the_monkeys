import { buildMainSitemap } from '@/app/sitemap';
import { generateMetadata as studioMetadata } from '@/app/snapshot/new/page';
import { MetaBlog } from '@/services/blog/blogTypes';
import { describe, expect, it } from 'vitest';

describe('main sitemap', () => {
  it('advertises the existing X tool once using its self-canonical URL', async () => {
    const metadata = await studioMetadata({ searchParams: { view: 'x' } });
    const entries = buildMainSitemap([]).filter(
      (entry) => entry.url === metadata.alternates?.canonical
    );
    expect(entries).toHaveLength(1);
    expect(entries[0].url).toBe('https://monkeys.com.co/snapshot/new?view=x');
    expect(
      buildMainSitemap([]).some((entry) => entry.url.includes('view=template'))
    ).toBe(false);
  });
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
    expect(urls).toContain('https://monkeys.com.co/learn');
    expect(urls).toContain('https://monkeys.com.co/blog/valid-post-1');
    expect(urls.some((url) => url.endsWith('sitemap.xml'))).toBe(false);
    expect(urls.some((url) => url.includes('unknown'))).toBe(false);
  });
});
