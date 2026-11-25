'use client';

import Link from 'next/link';

import { EventContentOptions } from '@/components/events/EventContentOptions';
import Icon from '@/components/icon';
import { ContentGate } from '@/components/moderation/ContentGate';
import { EVENTS_ROUTE } from '@/constants/routeConstants';
import { useViewerTimezone } from '@/hooks/events/useViewerTimezone';
import {
  eventDateParts,
  eventTypeLabel,
  formatEventCardWhen,
} from '@/lib/eventTime';
import type { EventItem } from '@/services/events/eventTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background-dark';
function LandingFeedEventContent({ event }: { event: EventItem }) {
  const timezone = useViewerTimezone();
  const date = eventDateParts(event.start_time, timezone);
  const href = `${EVENTS_ROUTE}/${event.slug}`;
  const description = purifyHTMLString(event.description || '');
  const label = event.tags?.[0] || eventTypeLabel(event.event_type);

  return (
    <article
      aria-label='Feed event'
      className='grid gap-4 rounded-xl border border-brand-orange/25 bg-background-light p-4 dark:border-brand-orange/30 dark:bg-background-dark sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-center sm:p-5'
    >
      <div className='flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-gray-50 text-center dark:bg-white/[0.05]'>
        <span className='font-inter text-[9px] font-bold uppercase tracking-wider text-brand-orange'>
          {date?.month || 'Soon'}
        </span>
        <span className='font-newsreader text-2xl font-semibold leading-none text-text-light dark:text-text-dark'>
          {date?.day || ''}
        </span>
      </div>
      <div className='min-w-0'>
        <p className='font-inter text-[10px] font-bold uppercase tracking-[0.14em] text-brand-orange'>
          {label}
        </p>
        <Link href={href} className={`mt-1 block ${focusRing}`}>
          <h2 className='line-clamp-2 font-newsreader text-xl font-semibold leading-tight text-text-light hover:text-brand-orange dark:text-text-dark sm:text-2xl'>
            {event.title}
          </h2>
        </Link>
        <p className='mt-1 font-inter text-xs text-gray-500 dark:text-gray-400'>
          {formatEventCardWhen(event.start_time, timezone)}
        </p>
        {description ? (
          <p
            className='mt-1 line-clamp-1 font-inter text-xs text-gray-500 dark:text-gray-400'
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : null}
      </div>
      <div className='flex items-center justify-between gap-3 sm:flex-col sm:items-end'>
        {typeof event.attendee_count === 'number' ? (
          <span className='font-inter text-xs text-gray-500 dark:text-gray-400'>
            {event.attendee_count} attending
          </span>
        ) : null}
        <Link
          href={href}
          className={`inline-flex min-h-10 items-center gap-2 rounded-lg bg-text-light px-4 py-2 font-inter text-xs font-semibold text-background-light transition hover:bg-brand-orange dark:bg-text-dark dark:text-background-dark ${focusRing}`}
        >
          View event
          <Icon name='RiArrowRight' size={15} />
        </Link>
      </div>
    </article>
  );
}

export function LandingFeedEvent({ event }: { event: EventItem }) {
  return (
    <div className='relative min-w-0'>
      <EventContentOptions
        event={event}
        className='absolute right-1 top-1 z-20'
      />
      <ContentGate
        content={event}
        target={{ kind: 'event', id: event.slug }}
        compact
        href={`${EVENTS_ROUTE}/${event.slug}`}
      >
        <LandingFeedEventContent event={event} />
      </ContentGate>
    </div>
  );
}
