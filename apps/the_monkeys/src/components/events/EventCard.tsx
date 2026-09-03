import Link from 'next/link';

import Icon from '@/components/icon';
import { EVENTS_ROUTE } from '@/constants/routeConstants';
import {
  eventStatusLabel,
  eventTypeLabel,
  formatEventWhen,
  formatPrice,
} from '@/lib/eventTime';
import { cn } from '@/lib/utils';
import { EventItem } from '@/services/events/eventTypes';

function Cover({ event }: { event: EventItem }) {
  if (event.cover_image) {
    return (
      <img
        src={event.cover_image}
        alt=''
        className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out'
        loading='lazy'
      />
    );
  }

  return (
    <div className='flex h-full w-full items-center justify-center bg-brand-orange/10 text-brand-orange'>
      <Icon name='RiCalendar' size={28} />
    </div>
  );
}

export function EventCard({ event }: { event: EventItem }) {
  const href = `${EVENTS_ROUTE}/${event.slug}`;
  const tag = event.tags?.[0];
  const lowest = event.ticket_tiers?.reduce<number | undefined>((min, t) => {
    if (min === undefined) return t.price;
    return Math.min(min, t.price);
  }, undefined);

  return (
    <article className='group flex items-start gap-4 sm:gap-6 py-5 border-b border-border-light dark:border-border-dark/40 last:border-b-0'>
      <div className='flex-1 min-w-0'>
        <div className='flex flex-wrap items-center gap-2'>
          {tag ? (
            <span className='font-inter font-bold text-[11px] text-brand-orange uppercase tracking-[0.15em]'>
              {tag}
            </span>
          ) : (
            <span className='font-inter font-bold text-[11px] text-brand-orange uppercase tracking-[0.15em]'>
              {eventTypeLabel(event.event_type)}
            </span>
          )}
          {event.status && event.status !== 'published' && (
            <span className='font-inter text-[10px] uppercase tracking-wider text-gray-500'>
              {eventStatusLabel(event.status)}
            </span>
          )}
        </div>

        <Link href={href} className='block mt-1.5'>
          <h3 className='font-newsreader font-bold md:text-2xl text-lg leading-[1.25] text-text-light dark:text-text-dark group-hover:text-brand-orange transition-colors line-clamp-2'>
            {event.title}
          </h3>
        </Link>

        <p className='mt-1.5 font-inter text-sm text-gray-500 dark:text-gray-400 line-clamp-1'>
          {formatEventWhen(event.start_time, event.end_time, event.timezone)}
        </p>

        <div className='mt-2 flex flex-wrap items-center gap-3 text-xs font-inter text-gray-500 dark:text-gray-400'>
          {event.organizer_username && (
            <Link
              href={`/${event.organizer_username}`}
              className='hover:text-brand-orange'
            >
              @{event.organizer_username}
            </Link>
          )}
          {event.location && event.event_type !== 'virtual' && (
            <span className='inline-flex items-center gap-1'>
              <Icon name='RiMapPinUser' size={14} />
              <span className='line-clamp-1'>{event.location}</span>
            </span>
          )}
          <span>{formatPrice(lowest, event.ticket_tiers?.[0]?.currency)}</span>
          {typeof event.attendee_count === 'number' && (
            <span className='inline-flex items-center gap-1'>
              <Icon name='RiGroup' size={14} />
              {event.attendee_count}
            </span>
          )}
        </div>
      </div>

      <Link
        href={href}
        className='shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800'
        aria-label={event.title}
      >
        <Cover event={event} />
      </Link>
    </article>
  );
}

export function EventHeroCard({ event }: { event: EventItem }) {
  const href = `${EVENTS_ROUTE}/${event.slug}`;

  return (
    <Link
      href={href}
      className='block group relative w-full overflow-hidden rounded-lg'
    >
      <div className='relative w-full aspect-[16/9] sm:aspect-[2/1] bg-gray-900'>
        {event.cover_image ? (
          <img
            src={event.cover_image}
            alt=''
            className='absolute inset-0 h-full w-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-[1.02] transition-all duration-700 ease-out'
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-brand-orange/40 to-black' />
        )}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent' />
        <div className='absolute inset-x-0 bottom-0 p-5 sm:p-7'>
          <p className='font-inter font-bold text-[11px] text-brand-orange uppercase tracking-[0.18em] mb-2'>
            {eventTypeLabel(event.event_type)} ·{' '}
            {formatEventWhen(event.start_time)}
          </p>
          <h3 className='font-newsreader font-bold text-2xl sm:text-3xl md:text-4xl leading-[1.15] text-white line-clamp-3 group-hover:text-brand-orange transition-colors'>
            {event.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export function EventEmpty({
  title,
  hint,
  className,
}: {
  title: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn('py-16 text-center', className)}>
      <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange'>
        <Icon name='RiCalendar' size={28} />
      </div>
      <h3 className='font-newsreader text-2xl font-bold'>{title}</h3>
      {hint && (
        <p className='mt-2 font-inter text-sm text-gray-500 dark:text-gray-400'>
          {hint}
        </p>
      )}
    </div>
  );
}
