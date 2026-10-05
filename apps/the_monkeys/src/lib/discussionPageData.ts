import { API_URL } from '@/constants/api';
import { fetchPublicGroups } from '@/lib/seoCatalog';
import {
  Discussion,
  DiscussionList,
} from '@/services/discussions/discussionsTypes';

export type DiscussionLoad =
  | { state: 'ok'; discussion: Discussion; indexable: boolean }
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
    if (anonymous.status === 200 && anonymous.discussion) {
      return {
        state: 'ok',
        discussion: anonymous.discussion,
        indexable: anonymous.discussion.status === 'visible',
      };
    }
    if (anonymous.status !== 404) return { state: 'unavailable' };
    if (!cookieHeader) return { state: 'missing' };

    const member = await readDiscussion(id, cookieHeader);
    if (member.status === 200 && member.discussion) {
      return { state: 'ok', discussion: member.discussion, indexable: false };
    }
    if (member.status === 404) return { state: 'missing' };
    return { state: 'unavailable' };
  } catch {
    return { state: 'unavailable' };
  }
}

export async function loadSiteDiscussions(
  beforeId?: string
): Promise<DiscussionList | null> {
  if (!origin()) return null;
  try {
    const query = beforeId ? `?before_id=${encodeURIComponent(beforeId)}` : '';
    const res = await fetch(`${origin()}/discussions${query}`, {
      cache: 'no-store',
    });
    if (res.status !== 200) return null;
    return (await res.json()) as DiscussionList;
  } catch {
    return null;
  }
}

async function readVisibleIds(url: string): Promise<string[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (res.status !== 200) return [];
    const data = (await res.json()) as Partial<DiscussionList> | null;
    if (!data || !Array.isArray(data.discussions)) return [];
    return data.discussions.flatMap((item) =>
      item && item.status === 'visible' && typeof item.public_id === 'string'
        ? [item.public_id]
        : []
    );
  } catch {
    return [];
  }
}

export async function loadPublicDiscussionIds(
  limit: number
): Promise<string[]> {
  if (!origin()) return [];
  const ids = new Set<string>();
  const add = (found: string[]) => {
    for (const id of found) {
      if (ids.size >= limit) return;
      ids.add(id);
    }
  };

  try {
    add(await readVisibleIds(`${origin()}/discussions`));
    if (ids.size >= limit) return Array.from(ids);

    const groups = await fetchPublicGroups(40);
    for (const group of groups) {
      if (ids.size >= limit) break;
      add(
        await readVisibleIds(
          `${origin()}/groups/${encodeURIComponent(group.slug)}/discussions`
        )
      );
    }
  } catch {
    // Keep whatever ids were collected before the failure.
  }
  return Array.from(ids);
}
