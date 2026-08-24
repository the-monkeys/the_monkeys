'use client';

import { useCallback } from 'react';

import Link from 'next/link';

import { EventActions } from '@/components/events/EventActions';
import { EventEmpty } from '@/components/events/EventCard';
import { EventComments } from '@/components/events/EventComments';
import { EventReactions } from '@/components/events/EventReactions';
import { RsvpPanel } from '@/components/events/RsvpPanel';
import { EventAttendees } from '@/components/events/detail/EventAttendees';
import { EventFaq } from '@/components/events/detail/EventFaq';
import { EventGallery } from '@/components/events/detail/EventGallery';
import { EventHost } from '@/components/events/detail/EventHost';
import { EventLocationMap } from '@/components/events/detail/EventLocationMap';
import { EventRelated } from '@/components/events/detail/EventRelated';
import { EventSeriesNote } from '@/components/events/detail/EventSeriesNote';
import { EventSidebarMeta } from '@/components/events/detail/EventSidebarMeta';
import { EventStickyBar } from '@/components/events/detail/EventStickyBar';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import { useEventDetail } from '@/hooks/events/useEventQueries';
import {
  eventStatusLabel,
  eventTypeLabel,
  formatEventWhen,
  isHost,
} from '@/lib/eventTime';
import { getShareMeta } from '@/services/events/eventsApi';

export default function EventDetailClient({ slug }: { slug: string }) {
  const { data: session } = useAuth();
  const { data, isLoading, isError } = useEventDetail(slug);
  const event = data?.event;
  const host = isHost(event, session?.username);

  const onShare = useCallback(async () => {
    if (!event) return;
    // Always share the URL for the host the visitor is actually on (prod
    // domain in production, localhost in dev). og_* copy is fine to reuse, but
    // og_url is a server-rendered canonical that must not override the origin.
    const url = `${window.location.origin}/events/${event.slug}`;
    try {
      const meta = await getShareMeta(event.slug).catch(() => null);
      if (navigator.share) {
        await navigator.share({
          title: meta?.og_title || event.title,
          text: meta?.og_description,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch {
      /* user dismissed the share sheet — no-op */
    }
  }, [event]);

  if (isLoading) {
    return (
      <div className='flex justify-center py-24'>
        <Loader size={32} />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <EventEmpty
        title='Event not found'
        hint='It may be private or removed.'
      />
    );
  }

  return (
    <>
      {/* Extra bottom padding leaves room for the fixed registration bar. */}
      <div className='mx-auto max-w-5xl pb-28'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12'>
          <article className='min-w-0'>
            {event.cover_image && (
              <div
                className='mb-6 overflow-hidden rounded-2xl bg-foreground-light/40 dark:bg-foreground-dark/30'
                style={{ aspectRatio: '16 / 9' }}
              >
                <img
                  src={event.cover_image}
                  alt=''
                  className='h-full w-full object-cover'
                  loading='eager'
                />
              </div>
            )}

            <p className='font-inter text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange'>
              {eventTypeLabel(event.event_type)}
              {event.status !== 'published'
                ? ` · ${eventStatusLabel(event.status)}`
                : ''}
            </p>

            {/* Fluid title scales smoothly across viewports via clamp(). */}
            <h1
              className='mt-2 font-newsreader font-bold leading-tight'
              style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}
            >
              {event.title}
            </h1>

            <p className='mt-3 font-inter text-sm text-gray-600 dark:text-gray-400 sm:text-base'>
              {formatEventWhen(
                event.start_time,
                event.end_time,
                event.timezone
              )}
              {event.timezone ? ` · ${event.timezone}` : ''}
            </p>

            <div className='mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500'>
              {event.organizer_username && (
                <Link
                  href={`/${event.organizer_username}`}
                  className='hover:text-brand-orange'
                >
                  Hosted by @{event.organizer_username}
                </Link>
              )}
              {event.location && event.event_type !== 'virtual' && (
                <span className='inline-flex items-center gap-1'>
                  <Icon name='RiMapPinUser' size={16} />
                  <span className='line-clamp-1'>{event.location}</span>
                </span>
              )}
              {typeof event.attendee_count === 'number' && (
                <span className='inline-flex items-center gap-1'>
                  <Icon name='RiGroup' size={16} />
                  {event.attendee_count} going
                </span>
              )}
              <EventSeriesNote event={event} />
            </div>

            {!!event.tags?.length && (
              <div className='mt-4 flex flex-wrap gap-2'>
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-full bg-foreground-light/50 px-3 py-1 font-inter text-xs dark:bg-foreground-dark/40'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className='mt-6'>
              <EventActions event={event} session={session} canManage={host} />
            </div>

            <div className='mt-8 space-y-10'>
              <EventHost event={event} />

              {event.description && (
                <div className='font-inter text-[15px] leading-7 whitespace-pre-wrap'>
                  {event.description}
                </div>
              )}

              <EventFaq faqs={event.faqs} />

              <EventLocationMap event={event} />

              {/* Mobile RSVP — the right rail is hidden below lg, so the panel
                  is shown inline. The sticky bar scrolls to whichever anchor
                  is currently visible. */}
              <div data-rsvp-anchor className='scroll-mt-24 lg:hidden'>
                <RsvpPanel
                  event={event}
                  viewerStatus={data?.viewer_rsvp_status}
                  session={session}
                />
              </div>

              <EventReactions event={event} session={session} />

              <EventAttendees event={event} canManage={host} />

              <EventGallery />

              <EventRelated event={event} />

              <EventComments event={event} session={session} />
            </div>
          </article>

          <aside className='hidden lg:block'>
            <div className='sticky top-24 space-y-6'>
              <div data-rsvp-anchor className='scroll-mt-24'>
                <RsvpPanel
                  event={event}
                  viewerStatus={data?.viewer_rsvp_status}
                  session={session}
                />
              </div>
              <EventSidebarMeta event={event} />
            </div>
          </aside>
        </div>
      </div>

      <EventStickyBar
        event={event}
        viewerStatus={data?.viewer_rsvp_status}
        onShare={onShare}
      />
    </>
  );
}
