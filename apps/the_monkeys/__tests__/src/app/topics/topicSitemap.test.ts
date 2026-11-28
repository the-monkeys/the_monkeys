import { buildTopicSitemap } from '@/app/topics/sitemap';
import { normalizePublicPosts } from '@/lib/seoCatalog';
import { describe, expect, it, vi } from 'vitest';

describe('topic sitemap eligibility', () => {
  it('includes only catalog topics with useful public posts and deduplicates slugs', () => {
    const posts = normalizePublicPosts({
      blogs: [
        { blog_id: '1', title: 'Learning Go', tags: ['GO', 'Invented topic'] },
        {
          blog_id: '2',
          title: 'Members post',
          tags: ['Business'],
          audience: 'group_only',
        },
      ],
    });
    expect(
      buildTopicSitemap(['Go', 'GO', 'Business', 'Empty', '中文'], posts).map(
        (entry) => entry.url
      )
    ).toEqual(['https://monkeys.com.co/topics/go']);
  });
  it('does not invent discoverable URLs for an empty public catalog', () => {
    expect(buildTopicSitemap(['Go'], [])).toEqual([]);
  });
});
