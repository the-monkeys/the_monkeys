import Link from 'next/link';

import { EventGridCard } from '@/components/events/EventGridCard';
import Icon from '@/components/icon';
import { EVENTS_ROUTE } from '@/constants/routeConstants';
import { eventDateParts, formatEventCardWhen } from '@/lib/eventTime';
import { EventItem } from '@/services/events/eventTypes';

interface LandingEventsSectionProps {
  events: EventItem[];
  isLoading: boolean;
  isError: boolean;
  variant?: 'cards' | 'compact';
  title?: string;
}

function BrowseEventsLink({ label }: { label: string }) {
  return (
    <Link
      href={EVENTS_ROUTE}
      className='inline-flex min-h-11 items-center gap-2 font-inter text-sm font-semibold text-text-light transition hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange dark:text-text-dark'
    >
      {label}
      <Icon name='RiArrowRight' size={17} />
    </Link>
  );
}

export function LandingEventsSection({
  events: eventItems,
  isLoading,
  isError,
  variant = 'cards',
  title = 'Upcoming events',
}: LandingEventsSectionProps) {
  const events = eventItems.slice(0, 3);

  if (variant === 'compact') {
    return (
      <section
        aria-labelledby='upcoming-events-heading'
        className='rounded-xl border border-border-light/70 bg-background-light p-5 dark:border-border-dark/40 dark:bg-background-dark'
      >
        <div className='flex items-center justify-between gap-3'>
          <h2
            id='upcoming-events-heading'
            className='font-inter text-xs font-bold uppercase tracking-[0.16em] text-text-light dark:text-text-dark'
          >
            {title}
          </h2>
          <Link
            href={EVENTS_ROUTE}
            className='inline-flex min-h-11 items-center text-xs font-semibold text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange'
          >
            View all events
          </Link>
        </div>

        {isLoading && (
          <div className='mt-2 divide-y divide-border-light/70 dark:divide-border-dark/40'>
            {Array.from({ length: 2 }, (_, index) => (
              <div
                key={index}
                aria-label='Loading event'
                className='flex min-h-20 animate-pulse items-center gap-3 py-3'
              >
                <span className='h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800' />
                <span className='h-4 flex-1 rounded bg-gray-100 dark:bg-gray-800' />
              </div>
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <p className='mt-3 font-inter text-sm leading-5 text-gray-500 dark:text-gray-400'>
            Upcoming events could not be loaded.
          </p>
        )}

        {!isLoading && !isError && events.length === 0 && (
          <p className='mt-3 font-inter text-sm leading-5 text-gray-500 dark:text-gray-400'>
            No upcoming events are scheduled yet.
          </p>
        )}

        {!isLoading && !isError && events.length > 0 && (
          <div className='mt-2 divide-y divide-border-light/70 dark:divide-border-dark/40'>
            {events.map((event) => {
              const date = eventDateParts(event.start_time, event.timezone);
              return (
                <article
                  key={event.id || event.slug}
                  className='group flex gap-3 py-3'
                >
                  <div className='flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-gray-50 text-center dark:bg-white/[0.04]'>
                    <span className='font-inter text-[9px] font-bold uppercase tracking-wider text-brand-orange'>
                      {date?.month || 'Soon'}
                    </span>
                    <span className='font-newsreader text-lg font-semibold leading-none text-text-light dark:text-text-dark'>
                      {date?.day || ''}
                    </span>
                  </div>
                  <div className='min-w-0'>
                    <Link
                      href={`${EVENTS_ROUTE}/${event.slug}`}
                      className='line-clamp-2 font-inter text-sm font-semibold leading-5 text-text-light transition group-hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange dark:text-text-dark'
                    >
                      {event.title}
                    </Link>
                    <p className='mt-1 font-inter text-[11px] text-gray-500 dark:text-gray-400'>
                      {formatEventCardWhen(event.start_time, event.timezone)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    );
  }

  return (
    <section
      aria-labelledby='upcoming-events-heading'
      className='py-10 sm:py-14'
    >
      <div className='mb-6 flex items-end justify-between gap-4 sm:mb-8'>
        <div>
          <p className='font-inter text-[11px] font-bold uppercase tracking-[0.2em] text-brand-orange'>
            Meet beyond the feed
          </p>
          <h2
            id='upcoming-events-heading'
            className='mt-2 font-newsreader text-3xl font-semibold tracking-[-0.025em] text-text-light dark:text-text-dark sm:text-4xl'
          >
            Upcoming events
          </h2>
          <p className='mt-2 max-w-xl font-inter text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base'>
            Join conversations, workshops, and gatherings hosted by the
            community.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className='-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3'>
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              aria-label='Loading event'
              className='min-w-[86%] snap-start overflow-hidden rounded-xl border border-border-light/70 dark:border-border-dark/40 sm:min-w-0'
            >
              <div className='aspect-[16/10] animate-pulse bg-gray-100 dark:bg-gray-800' />
              <div className='space-y-3 p-4'>
                <div className='h-3 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800' />
                <div className='h-6 w-4/5 animate-pulse rounded bg-gray-100 dark:bg-gray-800' />
                <div className='h-4 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-gray-800' />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className='flex min-h-28 flex-col items-start justify-center rounded-xl border border-border-light/70 px-5 py-4 dark:border-border-dark/40 sm:flex-row sm:items-center sm:justify-between'>
          <p className='font-inter text-sm text-gray-500 dark:text-gray-400'>
            Upcoming events could not be loaded.
          </p>
          <BrowseEventsLink label='Browse events' />
        </div>
      )}

      {!isLoading && !isError && events.length === 0 && (
        <div className='flex min-h-28 flex-col items-start justify-center rounded-xl border border-border-light/70 px-5 py-4 dark:border-border-dark/40 sm:flex-row sm:items-center sm:justify-between'>
          <p className='font-inter text-sm text-gray-500 dark:text-gray-400'>
            No upcoming events are scheduled yet.
          </p>
          <BrowseEventsLink label='Browse events' />
        </div>
      )}

      {!isLoading && !isError && events.length > 0 && (
        <>
          <div className='-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3'>
            {events.map((event) => (
              <div
                key={event.id || event.slug}
                className='min-w-[86%] snap-start sm:min-w-0'
              >
                <EventGridCard event={event} />
              </div>
            ))}
          </div>
          <div className='mt-4 flex sm:justify-end'>
            <BrowseEventsLink label='View all events' />
          </div>
        </>
      )}
    </section>
  );
}
