import { API_URL } from '@/constants/api';
import { toIsoTime } from '@/lib/eventTime';
import { publicEvent } from '@/lib/publicEvent';
import { queryKeys } from '@/lib/queryKeys';
import type {
  EventItem,
  ProtoTime,
  TicketTier,
} from '@/services/events/eventTypes';
import type { GroupItem } from '@/services/groups/groupsTypes';
import { QueryClient, dehydrate } from '@tanstack/react-query';

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function strings(raw: Record<string, unknown>, keys: string[]) {
  return Object.fromEntries(
    keys.flatMap((key) =>
      typeof raw[key] === 'string' ? [[key, raw[key]]] : []
    )
  );
}

function numbers(raw: Record<string, unknown>, keys: string[]) {
  return Object.fromEntries(
    keys.flatMap((key) =>
      typeof raw[key] === 'number' && Number.isFinite(raw[key])
        ? [[key, raw[key]]]
        : []
    )
  );
}

function tags(value: unknown): string[] | undefined {
  return Array.isArray(value)
    ? value.filter((tag): tag is string => typeof tag === 'string')
    : undefined;
}

function time(value: unknown): string | undefined {
  try {
    return toIsoTime(value as ProtoTime);
  } catch {
    return undefined;
  }
}

function validItem(raw: Record<string, unknown>, label: string) {
  return (
    Number.isSafeInteger(raw.id) &&
    Number(raw.id) > 0 &&
    typeof raw.slug === 'string' &&
    !!raw.slug.trim() &&
    typeof raw[label] === 'string' &&
    !!raw[label].trim() &&
    raw.visibility === 'public'
  );
}

// Only card fields enter the anonymous hydration payload. Detail and viewer data
// remain in their existing authenticated queries.
export function publicDirectoryEvents(items: unknown[]): EventItem[] {
  const seen = new Set<number>();
  return items.flatMap((raw) => {
    if (
      !record(raw) ||
      !validItem(raw, 'title') ||
      (raw.status !== 'published' && raw.status !== 'live') ||
      !['virtual', 'in_person', 'hybrid'].includes(String(raw.event_type)) ||
      seen.has(Number(raw.id))
    )
      return [];
    seen.add(Number(raw.id));
    const event = {
      id: raw.id,
      title: raw.title,
      slug: raw.slug,
      status: raw.status,
      visibility: 'public',
      event_type: raw.event_type,
      ...strings(raw, [
        'cover_image',
        'organizer_username',
        'organizer_account_id',
        'location',
        'recurrence_text',
        'group_slug',
        'group_name',
      ]),
      ...numbers(raw, ['attendee_count', 'series_id', 'group_id']),
      start_time: time(raw.start_time),
      end_time: time(raw.end_time),
      tags: tags(raw.tags),
      upcoming_dates: Array.isArray(raw.upcoming_dates)
        ? raw.upcoming_dates.map(time).filter(Boolean)
        : undefined,
      venue: record(raw.venue)
        ? strings(raw.venue, ['name', 'city'])
        : undefined,
      ticket_tiers: Array.isArray(raw.ticket_tiers)
        ? raw.ticket_tiers.flatMap((tier) =>
            record(tier) &&
            typeof tier.price === 'number' &&
            Number.isFinite(tier.price)
              ? [
                  {
                    ...strings(tier, ['name', 'currency']),
                    ...numbers(tier, [
                      'id',
                      'price',
                      'capacity',
                      'sort_order',
                      'booked',
                    ]),
                  } as TicketTier,
                ]
              : []
          )
        : undefined,
    } as EventItem;
    return [publicEvent(event)];
  });
}

export function publicDirectoryGroups(items: unknown[]): GroupItem[] {
  const seen = new Set<number>();
  return items.flatMap((raw) => {
    if (
      !record(raw) ||
      !validItem(raw, 'name') ||
      raw.status !== 'published' ||
      seen.has(Number(raw.id))
    )
      return [];
    seen.add(Number(raw.id));
    return [
      {
        id: raw.id,
        slug: raw.slug,
        name: raw.name,
        status: 'published',
        visibility: 'public',
        ...strings(raw, [
          'description',
          'cover_image',
          'logo_image',
          'city',
          'region',
          'country',
          'organizer_username',
        ]),
        ...numbers(raw, ['member_count']),
        topics: tags(raw.topics),
      } as GroupItem,
    ];
  });
}

async function readDirectory(
  path: string,
  field: 'events' | 'groups'
): Promise<unknown[]> {
  if (!API_URL) throw new Error('Public directory API unavailable');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`${API_URL.replace(/\/$/, '')}${path}`, {
      credentials: 'omit',
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Public directory request failed');
    const data: unknown = await response.json();
    if (
      !record(data) ||
      data.error ||
      (data[field] !== null && !Array.isArray(data[field]))
    )
      throw new Error('Invalid public directory response');
    return (data[field] || []) as unknown[];
  } finally {
    clearTimeout(timeout);
  }
}

export async function directoryPageState(includeEvents = false) {
  // Each render owns its cache; no cookies, personalized keys, or shared data.
  const client = new QueryClient({
    defaultOptions: { queries: { gcTime: Infinity } },
  });
  const groups = async () => {
    const items = publicDirectoryGroups(
      await readDirectory(
        '/groups?limit=30&offset=0&status=published&public_only=1',
        'groups'
      )
    ).slice(0, 30);
    // Mark anonymous seeds stale so the existing client hooks reconcile viewer
    // badges and location filters as soon as they become enabled.
    client.setQueryData(
      queryKeys.groups.list({ limit: 30, offset: 0 }),
      { groups: items },
      { updatedAt: 1 }
    );
    if (includeEvents)
      client.setQueryData(
        queryKeys.groups.list({ limit: 8 }),
        { groups: items.slice(0, 8) },
        { updatedAt: 1 }
      );
  };
  const events = async () => {
    const items = publicDirectoryEvents(
      await readDirectory('/events?limit=12&offset=0&date=upcoming', 'events')
    ).slice(0, 12);
    client.setQueryData(
      queryKeys.events.list({ limit: 12, offset: 0, date: 'upcoming' }),
      { events: items },
      { updatedAt: 1 }
    );
  };
  // An unavailable endpoint leaves its query unseeded for the existing browser
  // retry/loading behavior; one failed list never blocks the other directory.
  await Promise.allSettled(includeEvents ? [groups(), events()] : [groups()]);
  return dehydrate(client);
}
