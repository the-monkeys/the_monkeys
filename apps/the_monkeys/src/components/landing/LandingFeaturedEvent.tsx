'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { EventContentOptions } from '@/components/events/EventContentOptions';
import { EventHostName } from '@/components/events/EventHostName';
import Icon from '@/components/icon';
import { ContentGate } from '@/components/moderation/ContentGate';
import { contentOptionsImageClass } from '@/components/moderation/menuStyles';
import { ProfileFrame, ProfileImage } from '@/components/profileImage';
import { EVENTS_ROUTE } from '@/constants/routeConstants';
import { useViewerTimezone } from '@/hooks/events/useViewerTimezone';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import { authenticatedArticleImageUrl } from '@/lib/articleMedia';
import {
  eventDateParts,
  eventTypeLabel,
  formatEventCardWhen,
} from '@/lib/eventTime';
import { EventItem } from '@/services/events/eventTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[#171313]';

function eventPlace(event: EventItem): string {
  if (event.event_type === 'virtual') return 'Online';
  if (event.venue?.city) {
    return [event.venue.name, event.venue.city].filter(Boolean).join(', ');
  }
  return event.location || eventTypeLabel(event.event_type);
}

function displayOrganizer(username?: string): string | undefined {
  const normalized = username?.trim();
  if (!normalized || /^[a-f0-9]{32}$/i.test(normalized)) return undefined;
  return normalized;
}

function normalizeOrganizer(username?: string): string | undefined {
  return username?.trim() || undefined;
}

function LandingFeaturedEventContent({ event }: { event: EventItem }) {
  const href = `${EVENTS_ROUTE}/${event.slug}`;
  const title = purifyHTMLString(event.title);
  const description = purifyHTMLString(event.description || '');
  const category = event.tags?.[0] || eventTypeLabel(event.event_type);
  const timezone = useViewerTimezone();
  const [timeReady, setTimeReady] = useState(false);
  useEffect(() => setTimeReady(true), []);
  const date = eventDateParts(event.start_time, timezone);
  const rawOrganizer = normalizeOrganizer(event.organizer_username);
  const directOrganizer = displayOrganizer(rawOrganizer);
  const { user: organizerProfile } = useGetProfileInfoById(
    directOrganizer ? undefined : event.organizer_account_id
  );
  const resolvedProfile = event.organizer_account_id
    ? organizerProfile?.user
    : undefined;
  const resolvedOrganizer = normalizeOrganizer(resolvedProfile?.username);
  const organizer = directOrganizer || resolvedOrganizer;
  const organizerName = [
    resolvedProfile?.first_name,
    resolvedProfile?.last_name,
  ]
    .filter(Boolean)
    .join(' ');
  const organizerLabel =
    organizerName ||
    (displayOrganizer(organizer) ? `@${displayOrganizer(organizer)}` : '');

  return (
    <article
      aria-label='Featured event'
      className='group relative flex overflow-hidden rounded-xl bg-[#171313] text-white shadow-sm'
    >
      {event.cover_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={authenticatedArticleImageUrl(event.cover_image)}
          alt=''
          loading='eager'
          decoding='async'
          className='absolute inset-0 h-full w-full object-cover opacity-10 transition duration-700 group-hover:scale-[1.025]'
        />
      ) : (
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,87,67,0.3),transparent_42%),linear-gradient(145deg,#251918_0%,#100e0e_70%)]' />
      )}
      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20' />

      <div className='relative z-10 flex w-full flex-col p-4'>
        <div className='flex items-start justify-between gap-4 pr-11'>
          <div className='flex min-w-0 flex-wrap items-center gap-2'>
            <span className='rounded-full border border-brand-orange/50 bg-brand-orange/10 px-2.5 py-1 font-inter text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff9688]'>
              Featured event
            </span>
            <span className='font-inter text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff9688]'>
              {category}
            </span>
          </div>
          {date && (
            <span
              aria-busy={!timeReady}
              className='flex min-w-11 flex-col rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-center backdrop-blur-sm'
            >
              <span className='font-inter text-[10px] font-bold uppercase tracking-wider text-[#ff9688]'>
                <span className={timeReady ? '' : 'invisible'}>
                  {date.month}
                </span>
              </span>
              <span className='font-newsreader text-xl font-semibold leading-none'>
                <span className={timeReady ? '' : 'invisible'}>{date.day}</span>
              </span>
            </span>
          )}
        </div>

        <div className='mt-2'>
          <Link href={href} aria-label={title} className={`block ${focusRing}`}>
            <h2
              className='font-newsreader text-[1.65rem] font-semibold leading-[1.08] tracking-[-0.025em] sm:text-3xl'
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </Link>
          {description && (
            <p
              className='mt-2 line-clamp-2 font-inter text-sm leading-5 text-white/70'
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          <div className='mt-2 space-y-1.5 font-inter text-xs text-white/80'>
            <p className='flex items-center gap-2'>
              <Icon name='RiCalendar' size={15} className='text-[#ff9688]' />
              <span
                aria-busy={!timeReady}
                className={timeReady ? '' : 'invisible'}
              >
                {formatEventCardWhen(event.start_time, timezone)}
              </span>
            </p>
            <p className='flex items-center gap-2'>
              <Icon
                name={
                  event.event_type === 'virtual' ? 'RiCompass' : 'RiMapPinUser'
                }
                size={15}
                className='text-[#ff9688]'
              />
              {eventPlace(event)}
            </p>
            {organizerLabel && (
              <p className='flex min-w-0 items-center gap-2'>
                <Icon
                  name='RiUser'
                  size={15}
                  className='shrink-0 text-[#ff9688]'
                />
                <EventHostName
                  username={event.organizer_username}
                  accountId={event.organizer_account_id}
                  prefix='Hosted by '
                  className='text-white/80'
                />
              </p>
            )}
          </div>
        </div>

        <div className='mt-2 flex min-h-11 items-center justify-between gap-3 border-t border-white/10 pt-3'>
          <div
            role='group'
            aria-label='Event host and attendance'
            className='flex min-w-0 items-center gap-2'
          >
            {organizer && (
              <Link
                href={`/${organizer}`}
                aria-label='View event host profile'
                className={`shrink-0 rounded-full ${focusRing}`}
              >
                <span aria-hidden='true' className='block'>
                  <ProfileFrame className='h-8 w-8 border border-white/20'>
                    <ProfileImage
                      username={organizer}
                      alt={
                        organizerName
                          ? `Event host: ${organizerName}`
                          : 'Event host'
                      }
                    />
                  </ProfileFrame>
                </span>
              </Link>
            )}
            {typeof event.attendee_count === 'number' && (
              <span className='font-inter text-xs font-semibold text-white/80'>
                +{event.attendee_count} attending
              </span>
            )}
          </div>
          <Link
            href={href}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-orange px-4 py-2 font-inter text-sm font-semibold text-white transition hover:bg-brand-orange/90 ${focusRing}`}
          >
            View event
            <Icon name='RiArrowRight' size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function LandingFeaturedEvent({ event }: { event: EventItem }) {
  const href = `${EVENTS_ROUTE}/${event.slug}`;
  return (
    <div className='relative min-w-0'>
      <EventContentOptions
        event={event}
        className={`absolute right-0 top-0 z-20 ${contentOptionsImageClass}`}
      />
      <ContentGate
        content={event}
        target={{ kind: 'event', id: event.slug }}
        compact
        href={href}
      >
        <LandingFeaturedEventContent event={event} />
      </ContentGate>
    </div>
  );
}
