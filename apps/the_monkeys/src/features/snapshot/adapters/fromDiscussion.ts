import { discussionIsoTime } from '@/lib/discussionTime';
import { isPublicContentSafe } from '@/lib/publicContentSafety';
import type { Discussion } from '@/services/discussions/discussionsTypes';

import type { SnapshotAuthor, SnapshotInput } from '../types';

export function canSnapshotDiscussion(post: Discussion): boolean {
  return (
    isPublicContentSafe(post) &&
    post.status === 'visible' &&
    post.audience !== 'group_only' &&
    Boolean(post.public_id && post.body?.trim())
  );
}

export function fromDiscussion(
  post: Discussion,
  { origin, author }: { origin: string; author?: SnapshotAuthor }
): SnapshotInput {
  if (!canSnapshotDiscussion(post)) throw new Error('Snapshot unavailable');
  const handle = post.author_gone ? '' : (post.author_username ?? '').trim();
  return {
    source: 'discussion',
    sourceId: post.public_id,
    sourceUrl: `${origin.replace(/\/$/, '')}/discussions/${encodeURIComponent(post.public_id)}`,
    title: 'Discussion',
    description: post.body,
    quote: post.body,
    category: 'Discussions',
    publishedAt: discussionIsoTime(post.created_at),
    author: !handle
      ? { username: '', displayName: 'Deleted account' }
      : author?.username === handle
        ? author
        : { username: handle, displayName: `@${handle}` },
  };
}
