import type { EventItem } from '@/services/events/eventTypes';

/** Anonymous rendering must never hydrate attendee-only meeting access. */
export function publicEvent(event: EventItem): EventItem {
  const { meeting_link: _meetingLink, ...safeEvent } = event;
  return safeEvent;
}
