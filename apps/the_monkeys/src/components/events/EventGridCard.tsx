import Link from 'next/link';

import Icon from '@/components/icon';
import { EVENTS_ROUTE } from '@/constants/routeConstants';
import {
  eventDateParts,
  eventTypeLabel,
  formatEventWhen,
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
    <div className='absolute inset-0 flex items-center justify-center bg-brand-orange/10 text-brand-orange'>
      <Icon name='RiCalendar' size={32} />
    </div>
  );
}

// Vertical, cover-forward card for grid layouts (distinct from the horizontal
// EventCard used in editorial lists). 16:9 media, date badge, price tag.
export function EventGridCard({ event }: { event: EventItem }) {
  const href = `${EVENTS_ROUTE}/${event.slug}`;
  const date = eventDateParts(event.start_time, event.timezone);
  const price = formatPrice(
    lowestTierPrice(event),
    event.ticket_tiers?.[0]?.currency
  );

  return (
    <article className='group flex h-full flex-col overflow-hidden rounded-xl border border-border-light bg-white transition-shadow duration-300 hover:shadow-lg dark:border-border-dark/40 dark:bg-black/20'>
      <Link
        href={href}
        aria-label={event.title}
        className='relative block aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800'
      >
        <Cover event={event} />
        {date && (
          <span className='absolute left-3 top-3 flex flex-col items-center rounded-md bg-white/95 px-2 py-1 text-center leading-none shadow-sm dark:bg-black/80'>
            <span className='font-inter text-[10px] font-bold uppercase tracking-wider text-brand-orange'>
              {date.month}
            </span>
            <span className='font-newsreader text-base font-bold text-text-light dark:text-text-dark'>
              {date.day}
            </span>
          </span>
        )}
        <span className='absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 font-inter text-[11px] font-medium text-white'>
          {price}
        </span>
      </Link>

      <div className='flex flex-1 flex-col p-4'>
        <p className='font-inter text-[11px] font-bold uppercase tracking-[0.15em] text-brand-orange'>
          {event.tags?.[0] || eventTypeLabel(event.event_type)}
        </p>
        <Link href={href} className='mt-1.5 block'>
          <h3 className='font-newsreader text-lg font-bold leading-[1.25] text-text-light transition-colors line-clamp-2 group-hover:text-brand-orange dark:text-text-dark'>
            {event.title}
          </h3>
        </Link>
        <p className='mt-1.5 font-inter text-xs text-gray-500 line-clamp-1 dark:text-gray-400'>
          {formatEventWhen(event.start_time, undefined, event.timezone)}
        </p>

        <div className='mt-auto flex flex-wrap items-center gap-3 pt-3 font-inter text-xs text-gray-500 dark:text-gray-400'>
          {event.organizer_username && (
            <span className='inline-flex items-center gap-1 truncate'>
              <Icon name='RiUser' size={14} />@{event.organizer_username}
            </span>
          )}
          {typeof event.attendee_count === 'number' && (
            <span className='inline-flex items-center gap-1'>
              <Icon name='RiGroup' size={14} />
              {event.attendee_count}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
