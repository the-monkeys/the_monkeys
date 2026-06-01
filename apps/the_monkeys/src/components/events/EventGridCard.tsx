import Link from 'next/link';

import Icon from '@/components/icon';
import { EVENTS_ROUTE } from '@/constants/routeConstants';
import {
  eventDateParts,
  eventTypeLabel,
  formatEventCardWhen,
  formatPrice,
  lowestTierPrice,
} from '@/lib/eventTime';
import { EventItem } from '@/services/events/eventTypes';

function Cover({ event }: { event: EventItem }) {
  if (event.cover_image) {
    return (
      <img
        src={event.cover_image}
        alt=''
        loading='lazy'
        className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105'
      />
    );
  }
  return (
    <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-orange/10 via-[#FFF5F3] to-[#FFEEE8] dark:from-brand-orange/15 dark:via-brand-orange/5 dark:to-transparent text-brand-orange/60'>
      <Icon name='RiCalendar' size={36} />
    </div>
  );
}

function placeLabel(event: EventItem): string {
  if (event.event_type === 'virtual') return 'Online';
  if (event.venue?.city) {
    return [event.venue.name, event.venue.city].filter(Boolean).join(', ');
  }
  return event.location || eventTypeLabel(event.event_type);
}

// Removed thin wrapper — call eventDateParts directly to avoid arg mismatch.

export function EventGridCard({ event }: { event: EventItem }) {
  const href = `${EVENTS_ROUTE}/${event.slug}`;
  const date = eventDateParts(event.start_time, event.timezone);
  const price = formatPrice(
    lowestTierPrice(event),
    event.ticket_tiers?.[0]?.currency
  );
  const category = event.tags?.[0] || eventTypeLabel(event.event_type);

  return (
    <article className='group flex h-full flex-col overflow-hidden rounded-xl border border-border-light bg-background-light shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 dark:border-border-dark/40 dark:bg-background-dark'>
      <Link
        href={href}
        aria-label={event.title}
        className='relative block aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800'
      >
        <Cover event={event} />
        {date && (
          <span className='absolute left-3 top-3 flex min-w-[44px] flex-col items-center rounded-lg bg-background-light/95 px-2 py-1 text-center leading-none shadow-sm dark:bg-background-dark/90'>
            <span className='font-inter text-[10px] font-bold uppercase tracking-wider text-brand-orange'>
              {date.month}
            </span>
            <span className='font-newsreader text-lg font-bold text-text-light dark:text-text-dark'>
              {date.day}
            </span>
          </span>
        )}
        <span className='absolute bottom-3 right-3 rounded-full bg-black/80 px-2.5 py-1 font-inter text-[11px] font-semibold text-white shadow-sm dark:bg-black/70'>
          {price}
        </span>
      </Link>

      <div className='flex flex-1 flex-col p-4'>
        <p className='font-inter text-[11px] font-bold uppercase tracking-[0.16em] text-brand-orange'>
          {category}
        </p>
        <Link href={href} className='mt-1 block'>
          <h3 className='font-newsreader text-lg font-bold leading-[1.3] text-text-light line-clamp-2 transition-colors group-hover:text-brand-orange dark:text-text-dark'>
            {event.title}
          </h3>
        </Link>
        <p className='mt-1.5 font-inter text-sm text-gray-500 dark:text-gray-400'>
          {formatEventCardWhen(event.start_time, event.timezone)}
        </p>
        <p className='mt-1 flex items-center gap-1 font-inter text-sm text-gray-500 dark:text-gray-400'>
          <Icon
            name={event.event_type === 'virtual' ? 'RiCompass' : 'RiMapPinUser'}
            size={14}
            className='shrink-0'
          />
          <span className='truncate'>{placeLabel(event)}</span>
        </p>

        <div className='mt-auto flex items-center justify-between gap-3 pt-4 font-inter text-xs text-gray-500 dark:text-gray-400'>
          {event.organizer_username ? (
            <span className='flex items-center gap-1.5 truncate'>
              <Icon name='RiUser' size={14} className='opacity-70' />@
              {event.organizer_username}
            </span>
          ) : (
            <span />
          )}
          {typeof event.attendee_count === 'number' && (
            <span className='flex shrink-0 items-center gap-1.5'>
              <Icon name='RiUser' size={14} className='opacity-70' />
              {event.attendee_count} going
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
