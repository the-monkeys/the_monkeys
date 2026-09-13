'use client';

import Link from 'next/link';

import Icon from '@/components/icon';
import { ProfileFrame, ProfileImage } from '@/components/profileImage';
import { EVENTS_ROUTE } from '@/constants/routeConstants';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
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

export function LandingFeaturedEvent({ event }: { event: EventItem }) {
  const href = `${EVENTS_ROUTE}/${event.slug}`;
  const title = purifyHTMLString(event.title);
  const description = purifyHTMLString(event.description || '');
  const category = event.tags?.[0] || eventTypeLabel(event.event_type);
  const date = eventDateParts(event.start_time, event.timezone);
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
          src={event.cover_image}
          alt=''
          loading='eager'
          decoding='async'
          className='absolute inset-0 h-full w-full object-cover opacity-35 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-40'
        />
      ) : (
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,87,67,0.3),transparent_42%),linear-gradient(145deg,#251918_0%,#100e0e_70%)]' />
      )}
      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20' />

      <div className='relative z-10 flex w-full flex-col p-5 sm:p-6'>
        <div className='flex items-start justify-between gap-4'>
          <span className='rounded-full border border-brand-orange/50 bg-brand-orange/10 px-2.5 py-1 font-inter text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff9688]'>
            Featured event
          </span>
          {date && (
            <span className='flex min-w-12 flex-col rounded-lg border border-white/15 bg-white/10 px-2 py-1.5 text-center backdrop-blur-sm'>
              <span className='font-inter text-[10px] font-bold uppercase tracking-wider text-[#ff9688]'>
                {date.month}
              </span>
              <span className='font-newsreader text-xl font-semibold leading-none'>
                {date.day}
              </span>
            </span>
          )}
        </div>

        <div className='mt-5'>
          <p className='font-inter text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff9688]'>
            {category}
          </p>
          <Link
            href={href}
            aria-label={title}
            className={`mt-2 block ${focusRing}`}
          >
            <h2
              className='font-newsreader text-[1.65rem] font-semibold leading-[1.08] tracking-[-0.025em] sm:text-3xl'
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </Link>
          {description && (
            <p
              className='mt-3 line-clamp-3 font-inter text-sm leading-5 text-white/70'
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          <div className='mt-5 space-y-2 rounded-xl border border-white/10 bg-white/[0.055] p-3.5 font-inter text-xs text-white/80 backdrop-blur-sm'>
            <p className='flex items-center gap-2'>
              <Icon name='RiCalendar' size={15} className='text-[#ff9688]' />
              {formatEventCardWhen(event.start_time, event.timezone)}
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
              <p className='flex items-center gap-2'>
                <Icon name='RiUser' size={15} className='text-[#ff9688]' />
                Hosted by {organizerLabel}
              </p>
            )}
          </div>
        </div>

        <div className='mt-4 flex min-h-11 items-center justify-between gap-3 border-t border-white/10 pt-4'>
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
