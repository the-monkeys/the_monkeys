'use client';

import Link from 'next/link';

import Icon from '@/components/icon';
import { EVENTS_ROUTE } from '@/constants/routeConstants';
import { useEventList } from '@/hooks/events/useEventQueries';
import {
  eventPriceLabel,
  eventTypeLabel,
  formatEventWhen,
} from '@/lib/eventTime';
import { EventItem } from '@/services/events/eventTypes';

/**
 * "You may also like" — a compact 3-column grid of other published events,
 * excluding the current one. Reuses the shared events list query.
 */
export function EventRelated({ event }: { event: EventItem }) {
  const { data } = useEventList(
    { limit: 7, offset: 0, type: event.event_type },
    true
  );

  const related = (data?.events || [])
    .filter((e) => e.slug !== event.slug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section aria-labelledby='event-related-heading'>
      <h2
        id='event-related-heading'
        className='font-newsreader font-bold text-2xl md:text-3xl'
      >
        You may also like
      </h2>

      <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {related.map((e) => (
          <RelatedCard key={e.slug} event={e} />
        ))}
      </div>
    </section>
  );
}

function RelatedCard({ event }: { event: EventItem }) {
  return (
    <Link
      href={`${EVENTS_ROUTE}/${event.slug}`}
      className='group flex flex-col overflow-hidden rounded-2xl border border-border-light dark:border-border-dark/60 transition-colors hover:border-brand-orange'
    >
      <div
        className='relative bg-foreground-light/40 dark:bg-foreground-dark/30'
        style={{ aspectRatio: '16 / 9' }}
      >
        {event.cover_image ? (
          <img
            src={event.cover_image}
            alt=''
            loading='lazy'
            className='h-full w-full object-cover'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center text-brand-orange'>
            <Icon name='RiCalendar' size={24} />
          </div>
        )}
      </div>

      <div className='flex flex-1 flex-col p-4'>
        <p className='font-inter text-[10px] font-bold uppercase tracking-[0.15em] text-brand-orange'>
          {eventTypeLabel(event.event_type)}
        </p>
        <h3 className='mt-1 line-clamp-2 font-newsreader text-lg font-bold leading-snug group-hover:text-brand-orange'>
          {event.title}
        </h3>
        <p className='mt-1 line-clamp-1 font-inter text-xs text-gray-500 dark:text-gray-400'>
          {formatEventWhen(event.start_time, undefined, event.timezone)}
        </p>
        <p className='mt-2 font-inter text-xs font-medium'>
          {eventPriceLabel(event)}
        </p>
      </div>
    </Link>
  );
}
