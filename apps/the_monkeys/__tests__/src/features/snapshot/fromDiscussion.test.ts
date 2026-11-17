import {
  canSnapshotDiscussion,
  fromDiscussion,
} from '@/features/snapshot/adapters/fromDiscussion';
import { describe, expect, it } from 'vitest';

const post = {
  public_id: 'abc123',
  body: 'हिंदी चर्चा 🌍\nA second line',
  status: 'visible',
  author_username: 'alice',
};

describe('discussion Studio input', () => {
  it('preserves full text and original author identity and link', () => {
    const input = fromDiscussion(post, {
      origin: 'http://127.0.0.1:3000',
      author: { username: 'alice', displayName: 'Alice', isVerified: true },
    });
    expect(input).toMatchObject({
      source: 'discussion',
      sourceId: 'abc123',
      title: 'Discussion',
      description: post.body,
      quote: post.body,
      sourceUrl: 'http://127.0.0.1:3000/discussions/abc123',
      author: { username: 'alice', isVerified: true },
    });
  });

  it('never replaces a deleted author with the viewer or a stale profile', () => {
    const input = fromDiscussion(
      { ...post, author_gone: true },
      {
        origin: 'http://localhost:3000',
        author: { username: 'viewer', displayName: 'Viewer', isVerified: true },
      }
    );
    expect(input.author).toEqual({
      username: '',
      displayName: 'Deleted account',
    });
  });

  it('falls back to the stored handle without claiming verification on profile failure', () => {
    expect(
      fromDiscussion(post, { origin: 'http://localhost:3000' }).author
    ).toEqual({ username: 'alice', displayName: '@alice' });
    expect(
      fromDiscussion(post, {
        origin: 'http://localhost:3000',
        author: { username: 'viewer', displayName: 'Viewer', isVerified: true },
      }).author?.isVerified
    ).not.toBe(true);
  });

  it('preserves long text without clipping or splitting Unicode', () => {
    const body = 'नमस्ते 🌍 '.repeat(55);
    expect(
      fromDiscussion({ ...post, body }, { origin: 'http://localhost:3000' })
        .description
    ).toBe(body);
  });

  it.each(['deleted', 'hidden', ''])(
    'does not export a %s discussion',
    (status) => {
      expect(canSnapshotDiscussion({ ...post, status })).toBe(false);
    }
  );
  it('keeps legacy public posts supported and member-only posts protected', () => {
    expect(canSnapshotDiscussion(post)).toBe(true);
    expect(canSnapshotDiscussion({ ...post, audience: 'group_only' })).toBe(
      false
    );
    expect(canSnapshotDiscussion({ ...post, body: '' })).toBe(false);
  });
});
