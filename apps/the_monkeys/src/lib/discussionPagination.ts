import type {
  Discussion,
  DiscussionList,
} from '@/services/discussions/discussionsTypes';

export const DISCUSSION_PAGE_SIZE = 20;

export function discussionCursor(value: unknown): string | undefined {
  return typeof value === 'string' &&
    /^[A-Za-z0-9][A-Za-z0-9_/-]{0,199}$/.test(value)
    ? value
    : undefined;
}

export type PublicDiscussionPage = DiscussionList & { nextBeforeId?: string };

export function publicDiscussionPage(
  value: unknown
): PublicDiscussionPage | null {
  if (!value || typeof value !== 'object') return null;
  const raw = (value as Partial<DiscussionList>).discussions;
  // Empty protobuf lists, like empty audience strings, may be omitted.
  if (raw === undefined || raw === null) return { discussions: [] };
  if (!Array.isArray(raw)) return null;
  const discussions = raw.filter((post): post is Discussion => {
    if (!post || typeof post !== 'object') return false;
    const audience: unknown = post.audience;
    // Sparse legacy rows from public endpoints have no audience. Explicit
    // restrictions and unknown audiences must never become public discovery.
    return (
      Boolean(discussionCursor(post.public_id)) &&
      (post.body === undefined || typeof post.body === 'string') &&
      post.status === 'visible' &&
      (audience === undefined || audience === '' || audience === 'public')
    );
  });
  return {
    discussions: discussions.map((post) => ({
      ...post,
      body: post.body ?? '',
    })),
    // Advance using the raw tail even when some rows were filtered out.
    nextBeforeId:
      raw.length >= DISCUSSION_PAGE_SIZE
        ? discussionCursor(raw[raw.length - 1]?.public_id)
        : undefined,
  };
}
