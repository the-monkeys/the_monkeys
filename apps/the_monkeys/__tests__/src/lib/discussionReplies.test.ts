import {
  buildReplyTree,
  countVisibleReplies,
  flattenReplies,
} from '@/lib/discussionReplies';
import type { DiscussionReply } from '@/services/discussions/discussionsTypes';
import { describe, expect, it } from 'vitest';

function reply(
  public_id: string,
  parent_public_id?: string,
  status = 'visible',
  seconds = 0
): DiscussionReply {
  return {
    public_id,
    parent_public_id,
    status,
    body: status === 'visible' ? `text ${public_id}` : '',
    author_username: `user_${public_id}`,
    created_at: { seconds },
  };
}

describe('buildReplyTree', () => {
  it('nests replies under their parents at any depth', () => {
    const tree = buildReplyTree([
      reply('a'),
      reply('b', 'a'),
      reply('c', 'b'),
      reply('d', 'c'),
      reply('e'),
    ]);

    expect(tree.map((node) => node.reply.public_id)).toEqual(['a', 'e']);
    const d = tree[0].children[0].children[0].children[0];
    expect(d.reply.public_id).toBe('d');
  });

  it('keeps a removed reply that still has visible replies under it', () => {
    const tree = buildReplyTree([
      reply('a', undefined, 'hidden'),
      reply('b', 'a'),
    ]);

    expect(tree).toHaveLength(1);
    expect(tree[0].reply.status).toBe('hidden');
    expect(tree[0].children[0].reply.public_id).toBe('b');
  });

  it('drops removed replies with nothing visible under them', () => {
    const tree = buildReplyTree([
      reply('a'),
      reply('b', 'a', 'hidden'),
      reply('c', 'b', 'deleted'),
      reply('d', undefined, 'hidden'),
    ]);

    expect(tree.map((node) => node.reply.public_id)).toEqual(['a']);
    expect(tree[0].children).toEqual([]);
  });

  it('shows a reply whose parent is missing at the top level', () => {
    const tree = buildReplyTree([reply('b', 'gone')]);

    expect(tree.map((node) => node.reply.public_id)).toEqual(['b']);
  });
});

describe('countVisibleReplies', () => {
  it('counts only replies people can read', () => {
    const tree = buildReplyTree([
      reply('a', undefined, 'hidden'),
      reply('b', 'a'),
      reply('c', 'b'),
    ]);

    expect(countVisibleReplies(tree)).toBe(2);
  });
});

describe('flattenReplies', () => {
  it('lists every reply below a node in time order with its parent', () => {
    const [a] = buildReplyTree([
      reply('a', undefined, 'visible', 1),
      reply('b', 'a', 'visible', 2),
      reply('c', 'b', 'visible', 4),
      reply('d', 'a', 'visible', 3),
    ]);

    const flat = flattenReplies(a.children, a.reply);

    expect(flat.map((item) => item.reply.public_id)).toEqual(['b', 'd', 'c']);
    expect(flat.map((item) => item.parent.public_id)).toEqual(['a', 'a', 'b']);
  });
});
