import { API_URL, API_URL_V2 } from '@/constants/api';
import { fetchTopicCatalogStrict } from '@/lib/topicCatalog';
import { GetMetaFeedBlogs, MetaBlog } from '@/services/blog/blogTypes';
import { EventItem, ListEventsResp } from '@/services/events/eventTypes';
import { GroupItem, ListGroupsResp } from '@/services/groups/groupsTypes';

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

export function normalizePublicPosts(value: unknown): MetaBlog[] {
  const blogs =
    value && typeof value === 'object' && 'blogs' in value
      ? (value as { blogs?: unknown }).blogs
      : null;
  if (!Array.isArray(blogs)) return [];

  return blogs.flatMap((raw): MetaBlog[] => {
    if (!raw || typeof raw !== 'object') return [];
    const post = raw as Partial<MetaBlog>;
    if (
      typeof post.blog_id !== 'string' ||
      !post.blog_id.trim() ||
      typeof post.title !== 'string' ||
      !post.title.trim()
    ) {
      return [];
    }
    return [
      {
        blog_id: post.blog_id,
        title: post.title.trim(),
        first_image:
          typeof post.first_image === 'string' ? post.first_image : '',
        first_paragraph:
          typeof post.first_paragraph === 'string' ? post.first_paragraph : '',
        owner_account_id:
          typeof post.owner_account_id === 'string'
            ? post.owner_account_id
            : '',
        published_time:
          typeof post.published_time === 'string' ? post.published_time : '',
        tags: Array.isArray(post.tags)
          ? post.tags.filter((tag): tag is string => typeof tag === 'string')
          : [],
        ...(typeof post.like_count === 'number'
          ? { like_count: post.like_count }
          : {}),
        ...(typeof post.bookmark_count === 'number'
          ? { bookmark_count: post.bookmark_count }
          : {}),
        ...(typeof post.content_type === 'string'
          ? { content_type: post.content_type }
          : {}),
      },
    ];
  });
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

export async function fetchPublicPosts(pageSize = 500): Promise<MetaBlog[]> {
  const posts: MetaBlog[] = [];
  let offset = 0;

  for (let page = 0; page < 100; page += 1) {
    const data = await getJson<GetMetaFeedBlogs>(
      catalogOriginV2(),
      `/blog/meta-feed?limit=${pageSize}&offset=${offset}`
    );
    if (!data) break;
    const pagePosts = normalizePublicPosts(data);
    posts.push(...pagePosts);
    const rawCount = Array.isArray(data.blogs) ? data.blogs.length : 0;
    const total = totalFrom(data, 'total_blogs');
    if (
      rawCount === 0 ||
      rawCount < pageSize ||
      (total !== undefined && offset + rawCount >= total)
    ) {
      break;
    }
    offset += rawCount;
  }

  return uniqueBy(posts, (post) => post.blog_id);
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
