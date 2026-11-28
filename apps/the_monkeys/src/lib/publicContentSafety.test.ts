import {
  buildBlogJsonLd,
  buildBlogMetadata,
  canonicalBlogSlug,
} from '@/app/blog/[slug]/blogSeo';
import { buildMainSitemap } from '@/app/sitemap';
import { buildTopicJsonLd } from '@/app/topics/[topic]/topicSeo';
import {
  extractBlogImages,
  fromBlog as snapshotBlog,
} from '@/features/snapshot/adapters/fromBlog';
import {
  canSnapshotDiscussion,
  fromDiscussion,
} from '@/features/snapshot/adapters/fromDiscussion';
import { fromMetaBlog as snapshotMeta } from '@/features/snapshot/adapters/fromMetaBlog';
import {
  buildDiscussionJsonLd,
  buildDiscussionMetadata,
} from '@/lib/discussionSeo';
import { normalizePublicPosts } from '@/lib/publicPostMetadata';
import {
  fetchRecentPublicPosts,
  normalizePublicEvents,
  normalizePublicGroups,
} from '@/lib/seoCatalog';
import { eventJsonLd, groupJsonLd } from '@/lib/seoSchema';
import type { Blog, FollowingFeed, MetaBlog } from '@/services/blog/blogTypes';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import type { EventItem } from '@/services/events/eventTypes';
import type { GroupItem } from '@/services/groups/groupsTypes';
import {
  fromBlog,
  fromFollowingFeed,
  fromMetaBlog,
} from '@/utils/blogCardAdapters';
import { afterEach, describe, expect, it, vi } from 'vitest';

const secret = 'sensitive-private-text';
const image = 'https://example.com/sensitive-private-image.jpg';
const blog = {
  blog_id: '123',
  owner_account_id: 'author',
  is_draft: false,
  tags: [secret],
  blog: {
    time: 1,
    blocks: [
      { id: 'title', type: 'header', data: { text: secret } },
      { id: 'p', type: 'paragraph', data: { text: secret } },
      { id: 'image', type: 'image', data: { file: { url: image } } },
    ],
  },
} as Blog;
const meta = {
  blog_id: '123',
  title: secret,
  first_paragraph: secret,
  first_image: image,
  tags: [secret],
} as MetaBlog;
const event = {
  id: 1,
  slug: 'event',
  title: secret,
  description: secret,
  cover_image: image,
  event_type: 'virtual',
  status: 'published',
  visibility: 'public',
} as EventItem;
const group = {
  id: 1,
  slug: 'group',
  name: secret,
  description: secret,
  cover_image: image,
  status: 'published',
  visibility: 'public',
} as GroupItem;
const discussion = {
  public_id: 'discussion',
  body: secret,
  status: 'visible',
  audience: 'public',
} as Discussion;
const flags = [
  { is_nsfw: true },
  { content_rating: { is_nsfw: true, revealed: true, can_reveal: true } },
  { content_unavailable: true },
];
afterEach(() => vi.unstubAllGlobals());

describe('anonymous public output safety, including revealed viewer DTOs', () => {
  it.each(flags)('omits flagged content from every catalog: %j', (flag) => {
    expect(normalizePublicPosts({ blogs: [{ ...meta, ...flag }] })).toEqual([]);
    expect(normalizePublicEvents({ events: [{ ...event, ...flag }] })).toEqual(
      []
    );
    expect(normalizePublicGroups({ groups: [{ ...group, ...flag }] })).toEqual(
      []
    );
  });
  it.each(flags)(
    'never includes flagged article metadata or JSON-LD: %j',
    (flag) => {
      const post = { ...blog, ...flag };
      const metadata = buildBlogMetadata(post, '123');
      expect(JSON.stringify(metadata)).not.toContain(secret);
      expect(JSON.stringify(metadata)).not.toContain(image);
      expect(metadata.robots).toMatchObject({ index: false });
      expect(buildBlogJsonLd(post, '123')).toBeNull();
    }
  );
  it.each(flags)(
    'omits event, group and discussion schema and uses safe discussion metadata: %j',
    (flag) => {
      expect(eventJsonLd({ ...event, ...flag })).toBeNull();
      expect(groupJsonLd({ ...group, ...flag })).toBeNull();
      expect(buildDiscussionJsonLd({ ...discussion, ...flag })).toBeNull();
      expect(
        JSON.stringify(
          buildDiscussionMetadata({ ...discussion, ...flag }, true)
        )
      ).not.toContain(secret);
    }
  );
  it.each(flags)(
    'blocks every snapshot adapter, even after reveal: %j',
    (flag) => {
      expect(() => snapshotBlog({ ...blog, ...flag })).toThrow();
      expect(extractBlogImages({ ...blog, ...flag })).toEqual([]);
      expect(() => snapshotMeta({ ...meta, ...flag })).toThrow();
      expect(canSnapshotDiscussion({ ...discussion, ...flag })).toBe(false);
      expect(() =>
        fromDiscussion(
          { ...discussion, ...flag },
          { origin: 'https://example.com' }
        )
      ).toThrow();
    }
  );
  it.each(flags)(
    'preserves rating through every card adapter without deriving a sensitive slug: %j',
    (flag) => {
      for (const card of [
        fromBlog({ ...blog, ...flag }),
        fromMetaBlog({ ...meta, ...flag }),
        fromFollowingFeed({
          ...blog,
          ...flag,
          IsLikedByMe: false,
          IsBookmarkedByMe: false,
          author_list: [],
          content_type: 'article',
        }),
      ]) {
        expect(card).toMatchObject(flag);
        expect(card.slug).not.toContain(secret);
      }
      expect(canonicalBlogSlug({ ...blog, ...flag })).not.toContain(secret);
    }
  );
  it('preserves canonical article identity despite backend redacted headings', () => {
    expect(
      fromMetaBlog({ ...meta, is_nsfw: true, canonical_slug: 'original-123' })
        .slug
    ).toBe('original');
    expect(
      canonicalBlogSlug({
        ...blog,
        is_nsfw: true,
        canonical_slug: 'original-123',
      })
    ).toBe('original-123');
  });
  it('keeps legacy unflagged card content and URLs', () => {
    expect(fromMetaBlog(meta)).toMatchObject({
      title: secret,
      image,
      description: secret,
      slug: secret,
    });
    expect(snapshotBlog(blog).heroImageUrl).toBe(image);
    expect(buildBlogJsonLd(blog, '123')).not.toBeNull();
  });
  it.each(flags)(
    'guards direct sitemap and topic-schema callers too: %j',
    (flag) => {
      const posts = [{ ...meta, ...flag }];
      expect(JSON.stringify(buildMainSitemap(posts))).not.toContain(secret);
      expect(
        JSON.stringify(buildTopicJsonLd('Writing', 'writing', posts))
      ).not.toContain(secret);
    }
  );
  it('does not include a flagged reply in safe discussion schema', () => {
    const reply = { ...discussion, is_nsfw: true };
    const schema = buildDiscussionJsonLd({
      ...discussion,
      body: 'Safe discussion',
      replies: [reply],
    });
    expect(JSON.stringify(schema)).not.toContain(secret);
  });
  it('never caches moderation-sensitive public catalogs', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ blogs: [meta] }),
    });
    vi.stubGlobal('fetch', fetchMock);
    await fetchRecentPublicPosts();
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: 'no-store' });
    expect(fetchMock.mock.calls[0][1].next).toBeUndefined();
  });
});
