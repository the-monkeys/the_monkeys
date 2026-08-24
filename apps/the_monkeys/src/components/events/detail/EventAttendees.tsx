'use client';

import Link from 'next/link';

import Icon from '@/components/icon';
import { ProfileFrame, ProfileImage } from '@/components/profileImage';
import { useEventAttendees } from '@/hooks/events/useEventQueries';
import { EventItem } from '@/services/events/eventTypes';

/**
 * Attendee avatar grid. The full attendee list is host-only, so we degrade
 * gracefully: when the list is unavailable we still show the count pill using
 * event.attendee_count. Host/organizer is badged first.
 */
export function EventAttendees({
  event,
  canManage,
}: {
  event: EventItem;
  canManage?: boolean;
}) {
  const { data } = useEventAttendees(event.slug, canManage);
  const attendees = data?.attendees || [];
  const total = data?.total ?? event.attendee_count ?? attendees.length;

  const host = event.organizer_username;
  const shown = attendees.slice(0, 18);

  return (
    <section aria-labelledby='event-attendees-heading'>
      <div className='flex items-center justify-between gap-3'>
        <h2
          id='event-attendees-heading'
          className='font-newsreader font-bold text-2xl md:text-3xl'
        >
          Attendees
        </h2>
        {total > 0 && (
          <span className='rounded-full bg-foreground-light/50 dark:bg-foreground-dark/40 px-3 py-1 font-inter text-xs font-medium'>
            {total} attending
          </span>
        )}
      </div>

      {shown.length > 0 ? (
        <>
          <ul className='mt-4 grid grid-cols-4 gap-4 sm:grid-cols-6'>
            {shown.map((a) => {
              const isHost = !!host && a.user_name === host;
              return (
                <li
                  key={a.id}
                  className='flex flex-col items-center text-center'
                >
                  <div className='relative'>
                    <ProfileFrame className='h-12 w-12'>
                      {a.user_name ? (
                        <ProfileImage username={a.user_name} />
                      ) : (
                        <Icon name='RiUser' />
                      )}
                    </ProfileFrame>
                    {isHost && (
                      <span className='absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-brand-orange px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-white'>
                        Host
                      </span>
                    )}
                  </div>
                  {a.user_name && (
                    <Link
                      href={`/${a.user_name}`}
                      className='mt-2 line-clamp-1 font-inter text-xs text-gray-600 hover:text-brand-orange dark:text-gray-300'
                    >
                      @{a.user_name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {total > shown.length && (
            <Link
              href={`/events/${event.slug}/manage`}
              className='mt-4 inline-block font-inter text-sm text-brand-orange hover:underline'
            >
              See all {total}
            </Link>
          )}
        </>
      ) : (
        <p className='mt-4 font-inter text-sm text-gray-500 dark:text-gray-400'>
          {total > 0
            ? `${total} ${total === 1 ? 'person is' : 'people are'} attending.`
            : 'Be the first to RSVP.'}
        </p>
      )}
    </section>
  );
}
