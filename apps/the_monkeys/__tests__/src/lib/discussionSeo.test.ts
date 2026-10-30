import {
  buildDiscussionJsonLd,
  buildDiscussionMetadata,
  discussionAuthorName,
  discussionDescription,
  discussionHeadline,
  discussionsSitemap,
} from '@/lib/discussionSeo';
import { Discussion } from '@/services/discussions/discussionsTypes';
import { describe, expect, it } from 'vitest';

const post: Discussion = {
  public_id: 'abc',
  body: 'Chai notes\nA short public thread.',
  status: 'visible',
  author_username: 'dave',
  author_gone: false,
  group_slug: '',
  reply_count: 1,
  like_count: 2,
  liked: false,
  created_at: '2026-10-05T04:00:00Z',
  replies: [
    {
      public_id: 'r1',
      parent_public_id: '',
      body: 'Agreed.',
      status: 'visible',
      author_username: 'lee',
      author_gone: false,
      created_at: '2026-10-05T05:00:00Z',
    },
  ],
};

describe('discussionSeo', () => {
  it('builds a short headline and strips an em dash', () => {
    expect(discussionHeadline('Hello \u2014 world')).toBe('Hello, world');
    expect(discussionHeadline('   ')).toBe('Discussion');
  });

  it('names a deleted author', () => {
    expect(discussionAuthorName('dave', false)).toBe('dave');
    expect(discussionAuthorName('', true)).toBe('Deleted account');
    expect(discussionAuthorName(undefined, undefined)).toBe('Deleted account');
  });

  it('writes API timestamps as ISO dates in JSON-LD', () => {
    const seconds = Date.parse('2026-10-05T04:00:00Z') / 1000;
    const data = buildDiscussionJsonLd({
      ...post,
      created_at: { seconds },
      replies: [{ ...post.replies![0], created_at: { seconds } }],
    }) as { datePublished?: unknown; comment?: { dateCreated?: unknown }[] };
    expect(data.datePublished).toBe('2026-10-05T04:00:00.000Z');
    expect(data.comment?.[0].dateCreated).toBe('2026-10-05T04:00:00.000Z');
  });

  it('indexes a public post and hides a member-only post', () => {
    const pub = buildDiscussionMetadata(post, true);
    const priv = buildDiscussionMetadata(post, false);
    expect(pub.description).toBe(discussionDescription(post.body));
    expect(JSON.stringify(pub.robots)).toContain('"index":true');
    expect(JSON.stringify(priv.robots)).toContain('"index":false');
  });

  it('lists discussion ids as encoded sitemap urls', () => {
    expect(discussionsSitemap(['a b'], 'https://monkeys.com.co')).toEqual([
      {
        url: 'https://monkeys.com.co/discussions/a%20b',
        changeFrequency: 'daily',
        priority: 0.6,
      },
    ]);
    expect(discussionsSitemap([], 'https://monkeys.com.co')).toEqual([]);
  });

  it('emits DiscussionForumPosting text in JSON-LD', () => {
    const data = buildDiscussionJsonLd(post);
    expect(data['@type']).toBe('DiscussionForumPosting');
    expect(data.articleBody).toBe('Chai notes\nA short public thread.');
    expect(data.url).toContain('/discussions/abc');
  });
});
