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
    expect(JSON.stringify(pub.openGraph)).toContain('/discussions/abc/image');
    expect(JSON.stringify(pub.twitter)).toContain('/discussions/abc/image');
    expect(priv.openGraph).toBeUndefined();
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
    expect(data?.['@type']).toBe('DiscussionForumPosting');
    expect(data?.articleBody).toBe('Chai notes\nA short public thread.');
    expect(data?.url).toContain('/discussions/abc');
  });
});

describe('discussion author profile URLs', () => {
  it('identifies the original author and each visible reply author by their public profile', () => {
    const data = buildDiscussionJsonLd(post) as any;
    expect(data.author).toEqual({
      '@type': 'Person',
      name: 'dave',
      url: 'https://monkeys.com.co/dave',
    });
    expect(data.comment[0].author).toEqual({
      '@type': 'Person',
      name: 'lee',
      url: 'https://monkeys.com.co/lee',
    });
    expect(data?.url).toBe('https://monkeys.com.co/discussions/abc');
    expect(data.comment[0].url).toBe(
      'https://monkeys.com.co/discussions/abc#reply-r1'
    );
  });

  it('uses the trimmed case-preserving handle and URL-encodes profile path segments', () => {
    const data = buildDiscussionJsonLd({
      ...post,
      author_username: ' Gautam ',
      replies: [{ ...post.replies![0], author_username: 'नवीन' }],
    }) as any;
    expect(data.author.url).toBe('https://monkeys.com.co/Gautam');
    expect(data.comment[0].author.url).toBe(
      `https://monkeys.com.co/${encodeURIComponent('नवीन')}`
    );
  });

  it.each([
    { author_username: undefined, author_gone: undefined },
    { author_username: '', author_gone: false },
    { author_username: '  ', author_gone: false },
    { author_username: 'private_old_handle', author_gone: true },
  ])('keeps missing and deleted identities unlinked: %j', (identity) => {
    const data = buildDiscussionJsonLd({
      ...post,
      ...identity,
      replies: [{ ...post.replies![0], ...identity }],
    }) as any;
    expect(data.author).toEqual({ '@type': 'Person', name: 'Deleted account' });
    expect(data.comment[0].author).toEqual({
      '@type': 'Person',
      name: 'Deleted account',
    });
    expect(JSON.stringify(data)).not.toContain('private_old_handle');
  });

  it('does not add hidden reply text or author identities to the public markup', () => {
    const data = buildDiscussionJsonLd({
      ...post,
      replies: [
        post.replies![0],
        {
          ...post.replies![0],
          public_id: 'hidden',
          status: 'hidden',
          author_username: 'hidden_person',
          body: 'Hidden reply text',
        },
      ],
    }) as any;
    expect(data.comment).toHaveLength(1);
    expect(JSON.stringify(data)).not.toContain('hidden_person');
    expect(JSON.stringify(data)).not.toContain('Hidden reply text');
  });
});
