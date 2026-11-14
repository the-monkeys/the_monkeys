import { createElement } from 'react';

import {
  buildBlogMetadata,
  getBlogIdFromSlug,
} from '@/app/blog/[slug]/blogSeo';
import { GET as postFeed } from '@/app/posts/feed.xml/route';
import { buildMainSitemap } from '@/app/sitemap';
import { buildTopicJsonLd } from '@/app/topics/[topic]/topicSeo';
import { FeatureCard } from '@/components/editorial/FeatureCard';
import { Blog, MetaBlog } from '@/services/blog/blogTypes';
import { fromBlog, fromMetaBlog } from '@/utils/blogCardAdapters';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const { catalog } = vi.hoisted(() => ({ catalog: vi.fn() }));
vi.mock('@/lib/seoCatalog', () => ({
  fetchPublicPosts: catalog,
  fetchRecentPublicPosts: catalog,
}));

function records(title: string): { post: Blog; summary: MetaBlog } {
  const post: Blog = {
    blog_id: 'post123',
    owner_account_id: 'author1',
    is_draft: false,
    published_time: '2026-11-13T10:00:00Z',
    tags: ['Technology'],
    LikeCount: 0,
    like_count: 0,
    BookmarkCount: 0,
    bookmark_count: 0,
    blog: {
      time: 1,
      blocks: [
        {
          id: 'title',
          type: 'header',
          data: { text: title, level: 1 },
          author: [],
          time: 1,
        },
      ],
    },
  };
  return {
    post,
    summary: {
      blog_id: post.blog_id,
      title,
      owner_account_id: post.owner_account_id,
      published_time: post.published_time,
      tags: post.tags,
      first_image: '',
      first_paragraph: 'A useful public summary for readers.',
    },
  };
}

describe('post discovery canonical consistency', () => {
  it.each([
    'A short public title',
    'A careful practical guide to building thoughtful communities with creators and event hosts across countries and time zones while keeping every participant connected to useful knowledge',
    '<b>Research &amp; community</b> with <i>practical</i> evidence',
    'A creator&#39;s guide to communities',
    'A <b>Bold</b>World',
    'Community<br>Research',
    'A public title with a verylongword'.repeat(8),
  ])(
    'uses the existing page canonical in sitemap, RSS, topics and cards for %s',
    async (title) => {
      const { post, summary } = records(title);
      const canonical = buildBlogMetadata(post, 'legacy-alias-post123')
        .alternates?.canonical;
      catalog.mockResolvedValue([summary]);

      expect(
        buildMainSitemap([summary]).find((entry) =>
          entry.url.includes('/blog/')
        )?.url
      ).toBe(canonical);
      expect(
        buildTopicJsonLd('Technology', 'technology', [summary]).mainEntity
          .itemListElement[0].url
      ).toBe(canonical);
      const card = fromMetaBlog(summary);
      const fullCard = fromBlog(post);
      expect(
        `https://monkeys.com.co/blog/${fullCard.slug}-${fullCard.blogId}`
      ).toBe(canonical);
      expect(`https://monkeys.com.co/blog/${card.slug}-${card.blogId}`).toBe(
        canonical
      );
      expect(
        renderToStaticMarkup(createElement(FeatureCard, { blog: summary }))
      ).toContain(
        `href="${String(canonical).replace('https://monkeys.com.co', '')}"`
      );
      expect(await (await postFeed()).text()).toContain(
        `<link>${canonical}</link>`
      );
      expect(getBlogIdFromSlug('old-long-untruncated-alias-post123')).toBe(
        'post123'
      );
    }
  );

  it('retains the whole visible headline when its destination uses the existing shorter canonical', () => {
    const title =
      'Satoshi Nakamoto, The Man Who Invented Bitcoin and Disappeared, and the community that carried his ideas into a new era';
    const { summary } = records(title);
    expect(fromMetaBlog(summary).title).toBe(title);
  });
});
