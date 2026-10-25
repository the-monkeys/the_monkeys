import { EVENTS_ROUTE } from '@/constants/routeConstants';
import { eventLocationLabel, parseEventTime } from '@/lib/eventTime';
import { EventItem } from '@/services/events/eventTypes';

/**
 * Format a Date object to UTC basic format: YYYYMMDDTHHmmssZ
 * Used by Google Calendar and Yahoo Calendar.
 */
export function formatUtcCalendarDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

/**
 * Derives start and end times for an event.
 * If end time is missing or not after start time, defaults to 1 hour after start.
 */
export function getCalendarTimes(
  event: Pick<EventItem, 'start_time' | 'end_time'>
): { start: Date; end: Date } | null {
  const start = parseEventTime(event.start_time);
  if (!start) return null;

  let end = parseEventTime(event.end_time);
  if (!end || end.getTime() <= start.getTime()) {
    end = new Date(start.getTime() + 60 * 60 * 1000);
  }

  return { start, end };
}

/**
 * Resolves location string for calendar invites.
 */
export function getCalendarLocation(
  event: Pick<EventItem, 'location' | 'event_type' | 'meeting_link' | 'venue'>
): string {
  const label = eventLocationLabel(event as EventItem);
  if (label) return label;
  if (event.event_type === 'virtual') {
    return event.meeting_link || 'Online';
  }
  return event.meeting_link || '';
}

/**
 * Builds the event description including description text, meeting link, and monkeys event link.
 */
export function getCalendarDescription(
  event: Pick<EventItem, 'description' | 'meeting_link'>,
  eventUrl?: string
): string {
  const parts: string[] = [];
  if (event.description?.trim()) {
    parts.push(event.description.trim());
  }
  if (event.meeting_link) {
    parts.push(`Meeting link: ${event.meeting_link}`);
  }
  if (eventUrl) {
    parts.push(`Event link: ${eventUrl}`);
  }
  return parts.join('\n\n');
}

/**
 * Resolves the canonical event URL for deeplinks.
 */
export function getEventUrl(event: Pick<EventItem, 'slug'>): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${EVENTS_ROUTE}/${event.slug}`;
  }
  return `${EVENTS_ROUTE}/${event.slug}`;
}

/**
 * Builds Google Calendar TEMPLATE URL.
 * https://calendar.google.com/calendar/render?action=TEMPLATE&...
 */
export function buildGoogleCalendarUrl(
  event: EventItem,
  customUrl?: string
): string {
  const times = getCalendarTimes(event);
  const eventUrl = customUrl || getEventUrl(event);
  const details = getCalendarDescription(event, eventUrl);
  const location = getCalendarLocation(event);

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', event.title || '');

  if (times) {
    url.searchParams.set(
      'dates',
      `${formatUtcCalendarDate(times.start)}/${formatUtcCalendarDate(times.end)}`
    );
  }

  if (details) {
    url.searchParams.set('details', details);
  }

  if (location) {
    url.searchParams.set('location', location);
  }

  if (event.timezone) {
    url.searchParams.set('ctz', event.timezone);
  }

  return url.toString();
}

/**
 * Builds Outlook Web deeplink URL.
 * https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&...
 */
export function buildOutlookCalendarUrl(
  event: EventItem,
  customUrl?: string
): string {
  const times = getCalendarTimes(event);
  const eventUrl = customUrl || getEventUrl(event);
  const details = getCalendarDescription(event, eventUrl);
  const location = getCalendarLocation(event);

  const url = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
  url.searchParams.set('path', '/calendar/action/compose');
  url.searchParams.set('rru', 'addevent');
  url.searchParams.set('subject', event.title || '');

  if (times) {
    url.searchParams.set('startdt', times.start.toISOString());
    url.searchParams.set('enddt', times.end.toISOString());
  }

  if (details) {
    url.searchParams.set('body', details);
  }

  if (location) {
    url.searchParams.set('location', location);
  }

  return url.toString();
}

/**
 * Builds Yahoo Calendar URL.
 * https://calendar.yahoo.com/?v=60&...
 */
export function buildYahooCalendarUrl(
  event: EventItem,
  customUrl?: string
): string {
  const times = getCalendarTimes(event);
  const eventUrl = customUrl || getEventUrl(event);
  const details = getCalendarDescription(event, eventUrl);
  const location = getCalendarLocation(event);

  const url = new URL('https://calendar.yahoo.com/');
  url.searchParams.set('v', '60');
  url.searchParams.set('title', event.title || '');

  if (times) {
    url.searchParams.set('st', formatUtcCalendarDate(times.start));
    url.searchParams.set('et', formatUtcCalendarDate(times.end));
  }

  if (details) {
    url.searchParams.set('desc', details);
  }

  if (location) {
    url.searchParams.set('in_loc', location);
  }

  return url.toString();
}

export type CalendarUrls = {
  google: string;
  outlook: string;
  yahoo: string;
};

export function getCalendarUrls(
  event: EventItem,
  customUrl?: string
): CalendarUrls {
  return {
    google: buildGoogleCalendarUrl(event, customUrl),
    outlook: buildOutlookCalendarUrl(event, customUrl),
    yahoo: buildYahooCalendarUrl(event, customUrl),
  };
}
