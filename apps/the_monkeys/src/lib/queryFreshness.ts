import { QueryClient } from '@tanstack/react-query';

import { queryKeys } from './queryKeys';

/** Discover lists are user-generated and must refetch on mount/focus. */
export const LIVE_LIST_STALE_MS = 0;

/** Homepage invalidation stays separate from ordinary feed caches. */
export const HOMEPAGE_BLOG_QUERY_ROOT = queryKeys.blog.homepageRoot();

export async function invalidateAfterArticleWrite(qc: QueryClient) {
  await Promise.all([
    qc.invalidateQueries({ queryKey: HOMEPAGE_BLOG_QUERY_ROOT }),
    qc.invalidateQueries({ queryKey: queryKeys.blog.byUsernameRoot() }),
    qc.invalidateQueries({ queryKey: queryKeys.blog.drafts.all() }),
    qc.invalidateQueries({ queryKey: queryKeys.blog.scheduled.all() }),
  ]);
}

export async function invalidateAfterEventWrite(
  qc: QueryClient,
  slug?: string
) {
  await qc.invalidateQueries({ queryKey: queryKeys.events.all });
  if (!slug) return;
  await Promise.all([
    qc.invalidateQueries({ queryKey: queryKeys.events.detail(slug) }),
    qc.invalidateQueries({ queryKey: queryKeys.events.comments(slug) }),
    qc.invalidateQueries({ queryKey: queryKeys.events.attendees(slug) }),
    qc.invalidateQueries({ queryKey: queryKeys.events.coupons(slug) }),
  ]);
}

export async function invalidateAfterGroupWrite(
  qc: QueryClient,
  slug?: string
) {
  await qc.invalidateQueries({ queryKey: queryKeys.groups.all });
  if (!slug) return;
  await Promise.all([
    qc.invalidateQueries({ queryKey: queryKeys.groups.detail(slug) }),
    qc.invalidateQueries({ queryKey: queryKeys.groups.members(slug) }),
    qc.invalidateQueries({ queryKey: queryKeys.groups.blogs(slug) }),
    qc.invalidateQueries({ queryKey: queryKeys.groups.invites(slug) }),
  ]);
}

export async function invalidateAfterGroupEventWrite(
  qc: QueryClient,
  groupSlug?: string
) {
  await Promise.all([
    invalidateAfterEventWrite(qc),
    invalidateAfterGroupWrite(qc, groupSlug),
  ]);
}
