import { API_URL } from '@/constants/api';
import { EventItem, ListEventsResp } from '@/services/events/eventTypes';
import { GroupItem, ListGroupsResp } from '@/services/groups/groupsTypes';

const PRODUCTION_API = 'https://monkeys.com.co/api/v1';

function catalogOrigin(): string {
  return (API_URL || PRODUCTION_API).replace(/\/$/, '');
}

async function getJson<T>(path: string): Promise<T | null> {
  const url = `${catalogOrigin()}${path}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      // Do not cache 5xx/empty catalog responses or sitemaps stay blank.
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchPublicEvents(limit = 100): Promise<EventItem[]> {
  const data = await getJson<ListEventsResp>(
    `/events?date=upcoming&limit=${limit}`
  );
  return (data?.events || []).filter(
    (e) => e.slug && e.status !== 'draft' && e.status !== 'cancelled'
  );
}

export async function fetchPublicGroups(limit = 100): Promise<GroupItem[]> {
  const data = await getJson<ListGroupsResp>(
    `/groups?limit=${limit}&public_only=1`
  );
  return (data?.groups || []).filter(
    (g) =>
      g.slug &&
      g.visibility === 'public' &&
      (g.status === 'published' || !g.status)
  );
}
