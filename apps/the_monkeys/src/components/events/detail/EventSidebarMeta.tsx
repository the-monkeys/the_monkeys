import Icon from '@/components/icon';
import {
  eventDateParts,
  eventLocationLabel,
  formatEventWhen,
  formatVenueAddress,
  mapQuery,
} from '@/lib/eventTime';
import { EventItem } from '@/services/events/eventTypes';

/**
 * Sticky right-rail metadata: date/time card, venue card and an optional
 * community-chat quick-join callout. Purely informational — RSVP lives in the
 * RsvpPanel so payment logic is never duplicated.
 */
export function EventSidebarMeta({ event }: { event: EventItem }) {
  const parts = eventDateParts(event.start_time, event.timezone);
  const address = formatVenueAddress(event.venue);
  const locationLabel = eventLocationLabel(event);
  const query = mapQuery(event);
  const directionsHref = query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    : null;

  return (
    <div className='space-y-4'>
      {/* Date & time */}
      <div className='flex gap-4 rounded-2xl border border-border-light dark:border-border-dark/60 p-4'>
        {parts && (
          <div className='flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-border-light dark:border-border-dark/60 text-center'>
            <span className='font-inter text-[10px] font-bold uppercase leading-none text-brand-orange'>
              {parts.month}
            </span>
            <span className='font-dm_sans text-lg font-bold leading-tight'>
              {parts.day}
            </span>
          </div>
        )}
        <div className='min-w-0'>
          <p className='font-dm_sans font-semibold'>
            {parts ? parts.weekday : 'Date to be announced'}
          </p>
          <p className='mt-0.5 font-inter text-sm text-gray-500 dark:text-gray-400'>
            {formatEventWhen(event.start_time, event.end_time, event.timezone)}
          </p>
          {event.recurrence_text && (
            <p className='mt-1 inline-flex items-center gap-1 font-inter text-xs text-gray-500'>
              <Icon name='RiHistory' size={13} />
              {event.recurrence_text}
            </p>
          )}
        </div>
      </div>

      {/* Venue */}
      {(locationLabel || event.event_type === 'virtual') && (
        <div className='flex gap-4 rounded-2xl border border-border-light dark:border-border-dark/60 p-4'>
          <Icon
            name={event.event_type === 'virtual' ? 'RiLinks' : 'RiMapPinUser'}
            size={20}
            className='mt-0.5 shrink-0 text-brand-orange'
          />
          <div className='min-w-0'>
            <p className='font-dm_sans font-semibold'>
              {event.event_type === 'virtual'
                ? 'Online event'
                : event.venue?.name || locationLabel || 'Venue TBA'}
            </p>
            {address && (
              <p className='mt-0.5 font-inter text-sm text-gray-500 dark:text-gray-400'>
                {address}
              </p>
            )}
            {directionsHref && (
              <a
                href={directionsHref}
                target='_blank'
                rel='noreferrer'
                className='mt-1 inline-block font-inter text-sm text-brand-orange hover:underline'
              >
                View on map
              </a>
            )}
          </div>
        </div>
      )}

      {/* Community chat callout */}
      {event.meeting_link && (
        <a
          href={event.meeting_link}
          target='_blank'
          rel='noreferrer'
          className='flex items-center gap-3 rounded-2xl border border-alert-green/40 bg-alert-green/5 p-4 hover:bg-alert-green/10'
        >
          <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-alert-green/15 text-alert-green'>
            <Icon name='RiChat1' size={20} />
          </span>
          <span className='min-w-0'>
            <span className='block font-dm_sans font-semibold'>
              Join the chat
            </span>
            <span className='block font-inter text-sm text-gray-500 dark:text-gray-400'>
              Connect with attendees before the event.
            </span>
          </span>
        </a>
      )}
    </div>
  );
}
