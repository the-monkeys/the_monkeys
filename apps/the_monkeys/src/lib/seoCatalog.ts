import { API_URL, API_URL_V2 } from '@/constants/api';
import { normalizePublicPosts } from '@/lib/publicPostMetadata';
import { fetchTopicCatalogStrict } from '@/lib/topicCatalog';
import { GetMetaFeedBlogs, MetaBlog } from '@/services/blog/blogTypes';
import { EventItem, ListEventsResp } from '@/services/events/eventTypes';
import { GroupItem, ListGroupsResp } from '@/services/groups/groupsTypes';

export { normalizePublicPosts } from '@/lib/publicPostMetadata';

const PRODUCTION_API = 'https://monkeys.com.co/api/v1';
const PRODUCTION_API_V2 = 'https://monkeys.com.co/api/v2';

function catalogOrigin(): string {
  return (API_URL || PRODUCTION_API).replace(/\/$/, '');
}

function catalogOriginV2(): string {
  return (API_URL_V2 || PRODUCTION_API_V2).replace(/\/$/, '');
}

async function getJson<T>(origin: string, path: string): Promise<T | null> {
  const url = `${origin}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 300 },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Public catalog request failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

function totalFrom(value: unknown, field: string): number | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const total = (value as Record<string, unknown>)[field];
  return typeof total === 'number' && Number.isFinite(total) && total >= 0
    ? total
    : undefined;
}

function uniqueBy<T>(items: T[], key: (item: T) => string | number): T[] {
  const seen = new Set<string | number>();
  return items.filter((item) => {
    const value = key(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/** RSS is a recent-items feed, not a complete historical catalog traversal. */
export async function fetchRecentPublicPosts(): Promise<MetaBlog[]> {
  const data = await getJson<GetMetaFeedBlogs>(
    catalogOriginV2(),
    '/blog/meta-feed?limit=100&offset=0'
  );
  if (!data || (data.blogs !== null && !Array.isArray(data.blogs))) {
    throw new Error('Recent public post catalog is unavailable');
  }
  if (!data.blogs?.length && (totalFrom(data, 'total_blogs') ?? 0) > 0) {
    throw new Error('Recent public post catalog is incomplete');
  }
  return uniqueBy(
    normalizePublicPosts(data).slice(0, 100),
    (post) => post.blog_id
  );
}

export async function fetchPublicPosts(pageSize = 500): Promise<MetaBlog[]> {
  const posts: MetaBlog[] = [];
  let offset = 0;
  let knownTotal: number | undefined;
  const pages = new Set<string>();

  for (let page = 0; page < 100; page += 1) {
    const data = await getJson<GetMetaFeedBlogs>(
      catalogOriginV2(),
      `/blog/meta-feed?limit=${pageSize}&offset=${offset}`
    );
    if (!data) throw new Error('Public post catalog is unavailable');
    if (data.blogs !== null && !Array.isArray(data.blogs)) {
      throw new Error('Public post catalog returned an invalid post list');
    }
    const pagePosts = normalizePublicPosts(data);
    const rawCount = Array.isArray(data.blogs) ? data.blogs.length : 0;
    if (rawCount > 0) {
      const pageKey = JSON.stringify(data.blogs.map((post) => post?.blog_id));
      if (pages.has(pageKey))
        throw new Error('Public post catalog repeated a page without progress');
      pages.add(pageKey);
    }
    posts.push(...pagePosts);
    const total = totalFrom(data, 'total_blogs') ?? knownTotal;
    knownTotal = total;
    if (rawCount === 0 && total !== undefined && offset < total) {
      throw new Error(
        'Public post catalog is incomplete: remaining posts were not returned'
      );
    }
    if (
      rawCount === 0 ||
      (total === undefined && rawCount < pageSize) ||
      (total !== undefined && offset + rawCount >= total)
    ) {
      return uniqueBy(posts, (post) => post.blog_id);
    }
    offset += rawCount;
  }

  throw new Error('Public post catalog exceeded the discovery page limit');
}

export async function fetchPublicTopics(): Promise<string[]> {
  const catalog = await fetchTopicCatalogStrict();
  return Array.from(
    new Set(
      Object.values(catalog.category).flatMap((category) => category.Topics)
    )
  );
}

export function normalizePublicEvents(value: unknown): EventItem[] {
  const events =
    value && typeof value === 'object' && 'events' in value
      ? (value as { events?: unknown }).events
      : null;
  if (!Array.isArray(events)) return [];

  return events.filter((raw): raw is EventItem => {
    if (!raw || typeof raw !== 'object') return false;
    const event = raw as Partial<EventItem>;
    return (
      typeof event.id === 'number' &&
      typeof event.title === 'string' &&
      Boolean(event.title.trim()) &&
      typeof event.slug === 'string' &&
      Boolean(event.slug.trim()) &&
      ['virtual', 'in_person', 'hybrid'].includes(event.event_type || '') &&
      ['published', 'live', 'completed'].includes(event.status || '') &&
      event.visibility === 'public'
    );
  });
}

export async function fetchPublicEvents(pageSize = 100): Promise<EventItem[]> {
  const events: EventItem[] = [];
  let offset = 0;

  for (let page = 0; page < 100; page += 1) {
    const data = await getJson<ListEventsResp>(
      catalogOrigin(),
      `/events?date=all&limit=${pageSize}&offset=${offset}`
    );
    if (!data) break;
    const pageEvents = normalizePublicEvents(data);
    events.push(...pageEvents);
    const rawCount = Array.isArray(data.events) ? data.events.length : 0;
    const total = totalFrom(data, 'total');
    if (
      rawCount === 0 ||
      rawCount < pageSize ||
      (total !== undefined && offset + rawCount >= total)
    ) {
      break;
    }
    offset += rawCount;
  }

  return uniqueBy(events, (event) => event.id);
}

export function normalizePublicGroups(value: unknown): GroupItem[] {
  const groups =
    value && typeof value === 'object' && 'groups' in value
      ? (value as { groups?: unknown }).groups
      : null;
  if (!Array.isArray(groups)) return [];

  return groups.filter((raw): raw is GroupItem => {
    if (!raw || typeof raw !== 'object') return false;
    const group = raw as Partial<GroupItem>;
    return (
      typeof group.id === 'number' &&
      typeof group.name === 'string' &&
      Boolean(group.name.trim()) &&
      typeof group.slug === 'string' &&
      Boolean(group.slug.trim()) &&
      group.visibility === 'public' &&
      group.status === 'published'
    );
  });
}

export async function fetchPublicGroups(pageSize = 100): Promise<GroupItem[]> {
  const groups: GroupItem[] = [];
  let offset = 0;

  for (let page = 0; page < 100; page += 1) {
    const data = await getJson<ListGroupsResp>(
      catalogOrigin(),
      `/groups?limit=${pageSize}&offset=${offset}&public_only=1`
    );
    if (!data) break;
    const pageGroups = normalizePublicGroups(data);
    groups.push(...pageGroups);
    const rawCount = Array.isArray(data.groups) ? data.groups.length : 0;
    const total = totalFrom(data, 'total');
    if (
      rawCount === 0 ||
      rawCount < pageSize ||
      (total !== undefined && offset + rawCount >= total)
    ) {
      break;
    }
    offset += rawCount;
  }

  return uniqueBy(groups, (group) => group.id);
}
