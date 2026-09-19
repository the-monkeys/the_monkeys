import {
  buildBlogJsonLd,
  buildBlogMetadata,
  canonicalBlogSlug,
  getBlogIdFromSlug,
} from '@/app/blog/[slug]/blogSeo';
import { Blog } from '@/services/blog/blogTypes';
import { describe, expect, it } from 'vitest';

const blog: Blog = {
  blog_id: '123',
  owner_account_id: 'account-1',
  is_draft: false,
  published_time: '2026-09-10T10:00:00.000Z',
  tags: ['Business', 'AI'],
  LikeCount: 4,
  like_count: 4,
  BookmarkCount: 2,
  bookmark_count: 2,
  blog: {
    time: 1,
    blocks: [
      {
        id: 'title',
        type: 'header',
        data: { text: '<b>Useful Post</b>' },
        author: [],
        time: 1,
      },
      {
        id: 'short',
        type: 'paragraph',
        data: { text: 'Short.' },
        author: [],
        time: 1,
      },
      {
        id: 'description',
        type: 'paragraph',
        data: {
          text: 'The first substantial paragraph from the post explains the central idea clearly.',
        },
        author: [],
        time: 1,
      },
      {
        id: 'image',
        type: 'image',
        data: { file: { url: 'https://images.example.test/useful.jpg' } },
        author: [],
        time: 1,
      },
    ],
  },
};

describe('post SEO', () => {
  it('extracts only the terminal blog identifier from a public slug', () => {
    expect(getBlogIdFromSlug('useful-post-123')).toBe('123');
    expect(getBlogIdFromSlug('')).toBe('');
  });

  it('builds canonical article metadata from meaningful post content', () => {
    const metadata = buildBlogMetadata(blog, 'wrong-alias-123', 'Ada');

    expect(canonicalBlogSlug(blog)).toBe('useful-post-123');
    expect(metadata.title).toEqual({ absolute: 'Useful Post | Monkeys' });
    expect(metadata.description).toBe(
      'The first substantial paragraph from the post explains the central idea clearly.'
    );
    expect(metadata.alternates).toEqual({
      canonical: 'https://monkeys.com.co/blog/useful-post-123',
      types: {
        'application/rss+xml': 'https://monkeys.com.co/posts/feed.xml',
      },
    });
    expect(metadata.openGraph).toMatchObject({
      type: 'article',
      authors: ['Ada'],
      publishedTime: '2026-09-10T10:00:00.000Z',
    });
    expect(JSON.stringify(metadata)).not.toContain('/en-US');
    expect(JSON.stringify(metadata)).not.toContain('/de-DE');
  });

  it('connects Article schema to its author and legal publisher', () => {
    const schema = buildBlogJsonLd(blog, 'useful-post-123', 'Ada', 'ada');

    expect(schema).not.toBeNull();
    if (!schema) throw new Error('Expected public article schema');

    expect(schema).toMatchObject({
      '@type': 'Article',
      headline: 'Useful Post',
      author: {
        '@type': 'Person',
        name: 'Ada',
        url: 'https://monkeys.com.co/ada',
      },
      publisher: {
        '@id': 'https://buddhicintaka.com/#organization',
        name: 'Buddhicintaka (OPC) Pvt. Ltd.',
      },
      mainEntityOfPage: {
        '@id': 'https://monkeys.com.co/blog/useful-post-123',
      },
    });
    expect(schema.articleBody).toContain('central idea clearly');
  });

  it('does not build public SEO for members-only posts', () => {
    const privateBlog = { ...blog, audience: 'group_only' as const };
    const metadata = buildBlogMetadata(privateBlog, 'useful-post-123', 'Ada');

    expect(metadata.robots).toMatchObject({ index: false, follow: false });
    expect(metadata.openGraph).toBeUndefined();
    expect(buildBlogJsonLd(privateBlog, 'useful-post-123', 'Ada')).toBeNull();
  });
});
