import { discussionInstantMs } from '@/lib/discussionTime';
import type { DiscussionReply } from '@/services/discussions/discussionsTypes';

export type ReplyNode = {
  reply: DiscussionReply;
  children: ReplyNode[];
};

export type FlatReply = {
  reply: DiscussionReply;
  parent: DiscussionReply;
};

export function isVisibleReply(reply: DiscussionReply) {
  return reply.status === 'visible';
}

function prune(nodes: ReplyNode[]): ReplyNode[] {
  return nodes.flatMap((node) => {
    const children = prune(node.children);
    if (!isVisibleReply(node.reply) && children.length === 0) return [];
    return [{ reply: node.reply, children }];
  });
}

// Replies arrive oldest first, so a parent is always seen before its children.
// Removed replies stay only while something visible hangs below them.
export function buildReplyTree(replies: DiscussionReply[]): ReplyNode[] {
  const byId = new Map<string, ReplyNode>();
  const roots: ReplyNode[] = [];
  for (const reply of replies) {
    const node: ReplyNode = { reply, children: [] };
    byId.set(reply.public_id, node);
    const parent = reply.parent_public_id
      ? byId.get(reply.parent_public_id)
      : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  return prune(roots);
}

export function countVisibleReplies(nodes: ReplyNode[]): number {
  return nodes.reduce(
    (total, node) =>
      total +
      (isVisibleReply(node.reply) ? 1 : 0) +
      countVisibleReplies(node.children),
    0
  );
}

export function flattenReplies(
  nodes: ReplyNode[],
  parent: DiscussionReply
): FlatReply[] {
  const out: FlatReply[] = [];
  const walk = (children: ReplyNode[], from: DiscussionReply) => {
    for (const node of children) {
      out.push({ reply: node.reply, parent: from });
      walk(node.children, node.reply);
    }
  };
  walk(nodes, parent);
  return out.sort(
    (a, b) =>
      discussionInstantMs(a.reply.created_at) -
      discussionInstantMs(b.reply.created_at)
  );
}
