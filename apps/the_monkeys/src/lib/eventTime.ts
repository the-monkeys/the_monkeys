import { EventItem, EventType, ProtoTime } from '@/services/events/eventTypes';

export function parseEventTime(value: ProtoTime): Date | null {
  if (!value) return null;
  if (typeof value === 'string') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const seconds = Number(value.seconds ?? 0);
  if (!seconds) return null;
  return new Date(seconds * 1000 + Math.floor((value.nanos ?? 0) / 1e6));
}

export function toIsoTime(value: ProtoTime): string | undefined {
  return parseEventTime(value)?.toISOString();
}

export function toIso(date: Date): string {
  return date.toISOString();
}

export function toLocalInput(value: ProtoTime): string {
  const d = parseEventTime(value);
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromLocalInput(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

export function formatEventWhen(
  start: ProtoTime,
  end?: ProtoTime,
  timezone?: string
): string {
  const from = parseEventTime(start);
  if (!from) return '';

  const opts: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };
  if (timezone) opts.timeZone = timezone;

  const startLabel = from.toLocaleString(undefined, opts);
  const to = parseEventTime(end);
  if (!to) return startLabel;

  const sameDay = from.toDateString() === to.toDateString();
  const endLabel = to.toLocaleString(
    undefined,
    sameDay ? { hour: 'numeric', minute: '2-digit', timeZone: timezone } : opts
  );
  return `${startLabel} – ${endLabel}`;
}

/** Compact card line: "Sat, Aug 29 · 7:00 PM" */
export function formatEventCardWhen(
  start: ProtoTime,
  timezone?: string
): string {
  const d = parseEventTime(start);
  if (!d) return '';
  const tz = timezone || undefined;
  const date = d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: tz,
  });
  const time = d.toLocaleString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: tz,
  });
  return `${date} · ${time}`;
}

/** Compact extra series dates on a collapsed card: "Sep 5 · 12 · 19". */
export function formatUpcomingDates(
  dates: ProtoTime[] | undefined,
  timezone?: string
): string {
  if (!dates || dates.length < 2) return '';
  const parsed = dates
    .map((d) => parseEventTime(d))
    .filter((d): d is Date => !!d);
  if (parsed.length < 2) return '';
  const tz = timezone || undefined;
  return parsed
    .map((d, i) => {
      const day = d.toLocaleString(undefined, { day: 'numeric', timeZone: tz });
      const month = d.toLocaleString(undefined, {
        month: 'short',
        timeZone: tz,
      });
      if (i === 0) return `${month} ${day}`;
      const prevMonth = parsed[i - 1].toLocaleString(undefined, {
        month: 'short',
        timeZone: tz,
      });
      return prevMonth === month ? day : `${month} ${day}`;
    })
    .join(' · ');
}

/** Safety net for an older gateway that still returns every occurrence. */
export function uniqueSeriesEvents(events: EventItem[]): EventItem[] {
  const earliest = new Map<number, EventItem>();
  for (const e of events) {
    if (!e.series_id) continue;
    const prev = earliest.get(e.series_id);
    if (!prev) {
      earliest.set(e.series_id, e);
      continue;
    }
    const prevMs = parseEventTime(prev.start_time)?.getTime() ?? 0;
    const nextMs = parseEventTime(e.start_time)?.getTime() ?? Infinity;
    if (nextMs < prevMs) earliest.set(e.series_id, e);
  }
  const seen = new Set<number>();
  const out: EventItem[] = [];
  for (const e of events) {
    if (!e.series_id) {
      out.push(e);
      continue;
    }
    if (seen.has(e.series_id)) continue;
    seen.add(e.series_id);
    out.push(earliest.get(e.series_id)!);
  }
  return out;
}

export function eventTypeLabel(type?: EventType | string): string {
  if (type === 'in_person') return 'In person';
  if (type === 'hybrid') return 'Hybrid';
  if (type === 'virtual') return 'Online';
  return type || '';
}

export function eventStatusLabel(status?: string): string {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function isEventEnded(
  event?: Pick<EventItem, 'status' | 'end_time'>
): boolean {
  if (!event) return false;
  if (event.status === 'completed' || event.status === 'cancelled') return true;
  const end = parseEventTime(event.end_time);
  return !!end && end.getTime() < Date.now();
}

export function isRsvpClosed(
  event?: Pick<EventItem, 'rsvp_closes_at'>
): boolean {
  if (!event) return false;
  const closes = parseEventTime(event.rsvp_closes_at);
  return !!closes && closes.getTime() < Date.now();
}

const RSVP_CLOSE_HOURS = [12, 24, 72, 168] as const;

export function rsvpCloseHoursFromEvent(event?: EventItem): number {
  if (!event) return 0;
  if (event.rsvp_close_hours_before) return event.rsvp_close_hours_before;
  const start = parseEventTime(event.start_time);
  const closes = parseEventTime(event.rsvp_closes_at);
  if (!start || !closes) return 0;
  const hours = Math.round((start.getTime() - closes.getTime()) / 3_600_000);
  return RSVP_CLOSE_HOURS.find((h) => Math.abs(h - hours) <= 1) ?? 0;
}

export function isHost(
  event: EventItem | undefined,
  username?: string
): boolean {
  if (!event || !username) return false;
  if (event.organizer_username === username) return true;
  return event.co_host_usernames?.includes(username) ?? false;
}

export function isOrganizer(
  event: EventItem | undefined,
  username?: string
): boolean {
  return !!event && !!username && event.organizer_username === username;
}

export function formatPrice(price?: number, currency = 'INR'): string {
  if (!price) return 'Free';
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price}`;
  }
}

export function defaultTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function spotsLeft(event: EventItem): number | null {
  const tiers = event.ticket_tiers || [];
  if (tiers.length) {
    let cap = 0;
    let booked = 0;
    let hasCap = false;
    for (const t of tiers) {
      if (t.capacity) {
        hasCap = true;
        cap += t.capacity;
        booked += t.booked || 0;
      }
    }
    if (hasCap) return Math.max(0, cap - booked);
  }
  if (event.capacity && event.capacity > 0) {
    return Math.max(0, event.capacity - (event.attendee_count || 0));
  }
  return null;
}

export function lowestTierPrice(event: EventItem): number | undefined {
  return event.ticket_tiers?.reduce<number | undefined>((min, t) => {
    if (min === undefined) return t.price;
    return Math.min(min, t.price);
  }, undefined);
}

export function eventPriceLabel(event: EventItem): string {
  return formatPrice(lowestTierPrice(event), event.ticket_tiers?.[0]?.currency);
}

export function formatVenueAddress(venue?: EventItem['venue']): string {
  if (!venue) return '';
  return [
    venue.address_line1,
    venue.address_line2,
    venue.city,
    venue.region,
    venue.postal_code,
    venue.country,
  ]
    .filter(Boolean)
    .join(', ');
}

/** Human-readable location string, preferring a structured venue. */
export function eventLocationLabel(event: EventItem): string {
  if (event.venue?.name) {
    const addr = formatVenueAddress(event.venue);
    return addr ? `${event.venue.name}, ${addr}` : event.venue.name;
  }
  return event.location || '';
}

/** Builds an OpenStreetMap query string (no API key required). */
export function mapQuery(event: EventItem): string | null {
  if (event.venue?.latitude && event.venue?.longitude) {
    return `${event.venue.latitude},${event.venue.longitude}`;
  }
  const label = eventLocationLabel(event);
  return label ? label : null;
}

/** Split start time into calendar-card parts (weekday / day / month / time). */
export function eventDateParts(
  start: ProtoTime,
  timezone?: string
): { weekday: string; day: string; month: string; time: string } | null {
  const d = parseEventTime(start);
  if (!d) return null;
  const tz = timezone || undefined;
  return {
    weekday: d.toLocaleString(undefined, { weekday: 'long', timeZone: tz }),
    day: d.toLocaleString(undefined, { day: 'numeric', timeZone: tz }),
    month: d.toLocaleString(undefined, { month: 'short', timeZone: tz }),
    time: d.toLocaleString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: tz,
    }),
  };
}
