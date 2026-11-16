import { API_URL } from '@/constants/api';
import { isEventEnded } from '@/lib/eventTime';
import type { EventItem, ProtoTime } from '@/services/events/eventTypes';
import type { GroupItem } from '@/services/groups/groupsTypes';

type RecordValue = Record<string, unknown>;

function record(value: unknown): value is RecordValue {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function pick(value: RecordValue, keys: string[]): RecordValue {
  return Object.fromEntries(
    keys
      .filter(
        (key) =>
          typeof value[key] === 'string' ||
          (typeof value[key] === 'number' && Number.isFinite(value[key]))
      )
      .map((key) => [key, value[key]])
  );
}

function time(value: unknown): ProtoTime {
  if (typeof value === 'string')
    return Number.isFinite(new Date(value).getTime()) ? value : undefined;
  if (!record(value)) return undefined;
  const seconds = value.seconds;
  if (
    (typeof seconds !== 'string' && typeof seconds !== 'number') ||
    !Number.isFinite(Number(seconds))
  )
    return undefined;
  const nanos =
    typeof value.nanos === 'number' &&
    Number.isInteger(value.nanos) &&
    value.nanos >= 0 &&
    value.nanos < 1e9
      ? value.nanos
      : undefined;
  if (
    !Number.isFinite(
      new Date(Number(seconds) * 1000 + (nanos ?? 0) / 1e6).getTime()
    )
  )
    return undefined;
  return { seconds, ...(nanos !== undefined ? { nanos } : {}) };
}

/** Anonymous, bounded first-page data only; never forward a viewer cookie. */
async function readList(path: string, key: string): Promise<unknown[]> {
  if (!API_URL) return [];
  try {
    const response = await fetch(`${API_URL.replace(/\/$/, '')}${path}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return [];
    const data: unknown = await response.json();
    return record(data) && Array.isArray(data[key])
      ? (data[key] as unknown[])
      : [];
  } catch {
    return [];
  }
}

function strings(value: unknown): string[] | undefined {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : undefined;
}

export async function loadDiscoveryEvents(): Promise<EventItem[]> {
  const rows = await readList(
    '/events?limit=12&offset=0&date=upcoming',
    'events'
  );
  const seen = new Set<string>();
  return rows
    .flatMap((value) => {
      if (
        !record(value) ||
        value.visibility !== 'public' ||
        !['published', 'live'].includes(String(value.status)) ||
        typeof value.slug !== 'string' ||
        !value.slug.trim() ||
        typeof value.title !== 'string' ||
        !value.title.trim() ||
        !['virtual', 'in_person', 'hybrid'].includes(
          String(value.event_type)
        ) ||
        seen.has(value.slug)
      )
        return [];
      const event = pick(value, [
        'id',
        'slug',
        'title',
        'description',
        'start_time',
        'end_time',
        'timezone',
        'event_type',
        'location',
        'status',
        'visibility',
        'cover_image',
        'organizer_username',
        'organizer_account_id',
        'attendee_count',
        'series_id',
        'recurrence_text',
        'series_occurrence_at',
        'upcoming_dates',
      ]) as EventItem;
      // A public list response must not serialize access links or viewer details.
      if (record(value.venue))
        event.venue = pick(value.venue, ['name', 'city', 'region', 'country']);
      if (Array.isArray(value.ticket_tiers))
        event.ticket_tiers = value.ticket_tiers
          .filter(record)
          .map((tier) =>
            pick(tier, [
              'id',
              'name',
              'price',
              'currency',
              'capacity',
              'sort_order',
            ])
          ) as EventItem['ticket_tiers'];
      event.tags = strings(value.tags);
      event.start_time = time(value.start_time);
      event.end_time = time(value.end_time);
      event.series_occurrence_at = time(value.series_occurrence_at);
      if (Array.isArray(value.upcoming_dates))
        event.upcoming_dates = value.upcoming_dates.map(time).filter(Boolean);
      if (isEventEnded(event)) return [];
      seen.add(value.slug);
      return [event];
    })
    .slice(0, 12);
}

export async function loadDiscoveryGroups(): Promise<GroupItem[]> {
  const rows = await readList(
    '/groups?limit=30&offset=0&public_only=1',
    'groups'
  );
  const seen = new Set<string>();
  return rows
    .flatMap((value) => {
      if (
        !record(value) ||
        value.visibility !== 'public' ||
        value.status !== 'published' ||
        typeof value.slug !== 'string' ||
        !value.slug.trim() ||
        typeof value.name !== 'string' ||
        !value.name.trim() ||
        seen.has(value.slug)
      )
        return [];
      const group = pick(value, [
        'id',
        'slug',
        'name',
        'description',
        'visibility',
        'status',
        'city',
        'region',
        'country',
        'cover_image',
        'logo_image',
        'organizer_username',
        'member_count',
      ]) as GroupItem;
      group.topics = strings(value.topics);
      seen.add(value.slug);
      return [group];
    })
    .slice(0, 30);
}
