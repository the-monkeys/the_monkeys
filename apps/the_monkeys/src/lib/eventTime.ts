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

export function isValidTimezone(timezone: string): boolean {
  if (timezone !== 'UTC' && !timezone.includes('/')) return false;
  try {
    new Intl.DateTimeFormat('en', { timeZone: timezone }).format(0);
    return true;
  } catch {
    return false;
  }
}

function wallParts(date: Date, timezone: string): number[] {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  return ['year', 'month', 'day', 'hour', 'minute', 'second'].map((key) =>
    Number(parts.find((part) => part.type === key)?.value)
  );
}

const wallUtc = ([year, month, day, hour, minute, second]: number[]) =>
  Date.UTC(year, month - 1, day, hour, minute, second);

export function toLocalInput(
  value: ProtoTime,
  timezone = defaultTimezone()
): string {
  const d = parseEventTime(value);
  if (!d) return '';
  if (!isValidTimezone(timezone)) return '';
  const [year, month, day, hour, minute] = wallParts(d, timezone);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
}

export function fromLocalInput(
  value: string,
  timezone = defaultTimezone()
): string {
  if (!value) return '';
  if (!isValidTimezone(timezone))
    throw new Error('Choose a valid event timezone.');
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(
    value
  );
  if (!match) throw new Error('Enter a valid date and time.');
  const parts = match.slice(1).map((part) => Number(part || 0));
  const wall = wallUtc(parts);
  if (
    !Number.isFinite(wall) ||
    new Date(wall).toISOString().slice(0, 19) !==
      `${value.slice(0, 16)}:${match[6] || '00'}`
  ) {
    throw new Error('Enter a valid date and time.');
  }
  // Inspect offsets on both sides of transitions. A wall time can map to zero,
  // one, or two instants; never silently normalize a DST gap or choose a fold.
  const offsets = new Set<number>();
  for (let hours = -48; hours <= 48; hours += 6) {
    const probe = wall + hours * 3_600_000;
    offsets.add(wallUtc(wallParts(new Date(probe), timezone)) - probe);
  }
  const candidates = Array.from(offsets)
    .map((offset) => wall - offset)
    .filter(
      (instant) => wallUtc(wallParts(new Date(instant), timezone)) === wall
    );
  if (!candidates.length)
    throw new Error(
      'This time does not exist in the selected timezone because the clocks change. Choose another time.'
    );
  if (candidates.length > 1)
    throw new Error(
      'This time occurs twice in the selected timezone because the clocks change. Choose an unambiguous time.'
    );
  return new Date(candidates[0]).toISOString();
}

function formatInZone(
  date: Date,
  options: Intl.DateTimeFormatOptions,
  timezone?: string
): string {
  const opts: Intl.DateTimeFormatOptions = { ...options };
  if (timezone) opts.timeZone = timezone;
  try {
    return date.toLocaleString(undefined, opts);
  } catch {
    try {
      const { timeZone: _ignored, ...rest } = opts;
      return date.toLocaleString(undefined, rest);
    } catch {
      return '';
    }
  }
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
    timeZoneName: 'short',
  };
  const startLabel = formatInZone(from, opts, timezone);
  const to = parseEventTime(end);
  if (!to) return startLabel;

  const zone =
    timezone && isValidTimezone(timezone) ? timezone : defaultTimezone();
  const sameDay =
    toLocalInput(from.toISOString(), zone).slice(0, 10) ===
    toLocalInput(to.toISOString(), zone).slice(0, 10);
  const endLabel = formatInZone(
    to,
    sameDay
      ? { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }
      : opts,
    timezone
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
  const date = formatInZone(
    d,
    { weekday: 'short', month: 'short', day: 'numeric' },
    tz
  );
  const time = formatInZone(
    d,
    { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' },
    tz
  );
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
      const day = formatInZone(d, { day: 'numeric' }, tz);
      const month = formatInZone(d, { month: 'short' }, tz);
      if (i === 0) return `${month} ${day}`;
      const prevMonth = formatInZone(parsed[i - 1], { month: 'short' }, tz);
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
    weekday: formatInZone(d, { weekday: 'long' }, tz),
    day: formatInZone(d, { day: 'numeric' }, tz),
    month: formatInZone(d, { month: 'short' }, tz),
    time: formatInZone(
      d,
      { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' },
      tz
    ),
  };
}
