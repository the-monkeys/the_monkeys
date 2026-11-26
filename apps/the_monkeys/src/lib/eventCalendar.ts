import { isValidTimezone, parseEventTime } from '@/lib/eventTime';
import { EventItem, ProtoTime } from '@/services/events/eventTypes';

export type CalendarProvider = 'google' | 'outlook';
export type CalendarScope = 'this' | 'series';

function calendarInstant(value: ProtoTime): Date | null {
  // Never interpret an old timezone-less string in the viewing device's zone.
  if (typeof value === 'string' && !/(?:Z|[+-]\d{2}:?\d{2})$/i.test(value))
    return null;
  const date = parseEventTime(value);
  return date && Number.isFinite(date.getTime()) ? date : null;
}

export function getCalendarWindow(
  event: Pick<EventItem, 'start_time' | 'end_time'>
) {
  const start = calendarInstant(event.start_time);
  const end = calendarInstant(event.end_time);
  return start && end && end > start ? { start, end } : null;
}

export function buildCalendarProviderUrl(
  event: EventItem,
  provider: CalendarProvider,
  origin: string
): string | null {
  if (event.status === 'cancelled') return null;
  const window = getCalendarWindow(event);
  if (!window) return null;
  const { start, end } = window;
  const page = new URL(`/events/${encodeURIComponent(event.slug)}`, origin)
    .href;
  // Descriptions can contain private meeting details pasted by a host. Only
  // send the public title, physical location and event-page link to providers.
  const details = `View event details and RSVP on Monkeys: ${page}`;
  const location =
    event.event_type === 'virtual' ? 'Online event' : event.location || '';
  if (provider === 'google') {
    const compact = (date: Date) =>
      date
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}Z$/, 'Z');
    const url = new URL('https://calendar.google.com/calendar/render');
    url.search = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${compact(start)}/${compact(end)}`,
      details,
      location,
    }).toString();
    if (event.timezone && isValidTimezone(event.timezone))
      url.searchParams.set('ctz', event.timezone);
    return url.href;
  }
  const url = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
  url.search = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: details,
    location,
  }).toString();
  return url.href;
}
