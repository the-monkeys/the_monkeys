import { API_URL } from '@/constants/api';
import {
  PublicDiscussionPage,
  discussionCursor,
  publicDiscussionPage,
} from '@/lib/discussionPagination';
import { normalizePublicGroups } from '@/lib/seoCatalog';
import { Discussion } from '@/services/discussions/discussionsTypes';

export type DiscussionLoad =
  | {
      state: 'ok';
      discussion: Discussion;
      indexable: boolean;
      publicDiscussion?: Discussion;
    }
  | { state: 'missing' }
  | { state: 'unavailable' };

function origin(): string {
  return (API_URL || '').replace(/\/$/, '');
}

async function readDiscussion(
  id: string,
  cookieHeader: string
): Promise<{ status: number; discussion?: Discussion }> {
  const res = await fetch(`${origin()}/discussions/${encodeURIComponent(id)}`, {
    cache: 'no-store',
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });
  if (res.status !== 200) return { status: res.status };
  return { status: 200, discussion: (await res.json()) as Discussion };
}

export async function loadDiscussion(
  id: string,
  cookieHeader: string
): Promise<DiscussionLoad> {
  if (!origin()) return { state: 'unavailable' };
  try {
    const anonymous = await readDiscussion(id, '');
    const publicDiscussion =
      anonymous.status === 200 ? anonymous.discussion : undefined;
    if (anonymous.status !== 200 && anonymous.status !== 404)
      return { state: 'unavailable' };
    if (!cookieHeader && publicDiscussion) {
      return {
        state: 'ok',
        discussion: publicDiscussion,
        indexable: publicDiscussion.status === 'visible',
        publicDiscussion,
      };
    }
    if (!cookieHeader) return { state: 'missing' };

    const member = await readDiscussion(id, cookieHeader);
    if (member.status === 200 && member.discussion) {
      const indexable =
        publicDiscussion?.status === 'visible' &&
        member.discussion.status === 'visible' &&
        member.discussion.audience !== 'group_only';
      return {
        state: 'ok',
        discussion: member.discussion,
        indexable,
        ...(indexable ? { publicDiscussion } : {}),
      };
    }
    if (member.status === 404) return { state: 'missing' };
    return { state: 'unavailable' };
  } catch {
    return { state: 'unavailable' };
  }
}

export async function loadSiteDiscussions(
  beforeId?: string,
  cookieHeader = ''
): Promise<PublicDiscussionPage | null> {
  if (!origin()) return null;
  try {
    const cursor = discussionCursor(beforeId);
    const query = cursor ? `?before_id=${encodeURIComponent(cursor)}` : '';
    const res = await fetch(`${origin()}/discussions${query}`, {
      cache: 'no-store',
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });
    if (res.status !== 200) return null;
    return publicDiscussionPage(await res.json());
  } catch {
    return null;
  }
}

async function readPublicPage(
  url: string
): Promise<PublicDiscussionPage | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (res.status !== 200) return null;
    return publicDiscussionPage(await res.json());
  } catch {
    return null;
  }
}

export async function loadPublicDiscussionIds(
  limit: number
): Promise<string[]> {
  if (!origin() || !Number.isFinite(limit) || limit < 1) return [];
  const maxIds = Math.min(Math.floor(limit), 1000);
  const ids = new Set<string>();
  // Bound total discussion requests as well as each scope, including pages
  // whose rows are all filtered out. One additional request lists public groups.
  let remainingPages = 40;
  const traverse = async (base: string) => {
    let cursor: string | undefined;
    const cursors = new Set<string>();
    for (
      let page = 0;
      page < 10 && remainingPages > 0 && ids.size < maxIds;
      page++
    ) {
      remainingPages--;
      const query = cursor ? `?before_id=${encodeURIComponent(cursor)}` : '';
      const found = await readPublicPage(`${base}${query}`);
      if (!found) break;
      for (const post of found.discussions) {
        ids.add(post.public_id);
        if (ids.size >= maxIds) return;
      }
      const next = found.nextBeforeId;
      if (!next || cursors.has(next)) break;
      cursors.add(next);
      cursor = next;
    }
  };

  try {
    await traverse(`${origin()}/discussions`);
    if (ids.size >= maxIds || remainingPages === 0) return Array.from(ids);

    const res = await fetch(
      `${origin()}/groups?limit=40&offset=0&public_only=1`,
      {
        next: { revalidate: 300 },
      }
    );
    if (res.status !== 200) return Array.from(ids);
    const groups = normalizePublicGroups(await res.json()).slice(0, 40);
    const seenGroups = new Set<string>();
    for (const group of groups) {
      if (ids.size >= maxIds || remainingPages === 0) break;
      if (seenGroups.has(group.slug)) continue;
      seenGroups.add(group.slug);
      await traverse(
        `${origin()}/groups/${encodeURIComponent(group.slug)}/discussions`
      );
    }
  } catch {
    // Keep whatever ids were collected before the failure.
  }
  return Array.from(ids);
}
