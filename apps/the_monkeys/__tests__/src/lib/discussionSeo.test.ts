import {
  buildDiscussionJsonLd,
  buildDiscussionMetadata,
  discussionAuthorName,
  discussionDescription,
  discussionHeadline,
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
  });

  it('indexes a public post and hides a member-only post', () => {
    const pub = buildDiscussionMetadata(post, true);
    const priv = buildDiscussionMetadata(post, false);
    expect(pub.description).toBe(discussionDescription(post.body));
    expect(JSON.stringify(pub.robots)).toContain('"index":true');
    expect(JSON.stringify(priv.robots)).toContain('"index":false');
  });

  it('emits DiscussionForumPosting text in JSON-LD', () => {
    const data = buildDiscussionJsonLd(post);
    expect(data['@type']).toBe('DiscussionForumPosting');
    expect(data.articleBody).toBe('Chai notes\nA short public thread.');
    expect(data.url).toContain('/discussions/abc');
  });
});
