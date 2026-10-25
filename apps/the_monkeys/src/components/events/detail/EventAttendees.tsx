'use client';

import Link from 'next/link';

import Icon from '@/components/icon';
import { ProfileFrame, ProfileImage } from '@/components/profileImage';
import { VerifiedBadge } from '@/components/user/VerifiedBadge';
import { useEventAttendees } from '@/hooks/events/useEventQueries';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import useUser from '@/hooks/user/useUser';
import { Attendee, EventItem } from '@/services/events/eventTypes';

function AttendeeIdentity({
  attendee,
  isHost,
}: {
  attendee: Attendee;
  isHost: boolean;
}) {
  const username = attendee.user_name?.trim() || undefined;
  const { user: byUsername, isLoading } = useUser(username);
  const { user: byAccount } = useGetProfileInfoById(
    !username || (!isLoading && !byUsername) ? attendee.account_id : undefined
  );
  const profile = byUsername || byAccount?.user;
  const profileUsername = profile?.username?.trim() || username;
  const displayName = [profile?.first_name, profile?.last_name]
    .filter((name): name is string => typeof name === 'string' && !!name.trim())
    .map((name) => name.trim())
    .join(' ');
  const readableUsername =
    profileUsername && !/^[a-f0-9]{32}$/i.test(profileUsername)
      ? profileUsername
      : undefined;
  const label =
    displayName || (readableUsername ? `@${readableUsername}` : 'Attendee');
  const isVerified = profile?.is_verified === true;
  const className =
    'group/author flex w-full min-w-0 max-w-full flex-col items-center gap-2 rounded-lg px-1 py-2 text-center font-inter text-xs leading-5 text-gray-600 dark:text-gray-300';
  const content = (
    <>
      <div className='relative mb-1 shrink-0'>
        <ProfileFrame className='h-12 w-12 shrink-0 sm:h-14 sm:w-14'>
          {profileUsername ? (
            <ProfileImage username={profileUsername} alt={label} />
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
      <span className='inline-flex min-w-0 max-w-full items-start justify-center gap-1'>
        <span className='line-clamp-2 min-w-0 [overflow-wrap:anywhere]'>
          {label}
        </span>
        {isVerified && (
          <span className='mt-0.5 shrink-0'>
            <VerifiedBadge isVerified showText={false} size={14} />
          </span>
        )}
      </span>
    </>
  );

  return (
    <li className='min-w-0 max-w-full'>
      {profileUsername ? (
        <Link
          href={`/${profileUsername}`}
          title={label}
          aria-label={isVerified ? `${label}, verified account` : label}
          className={`${className} hover:bg-foreground-light/30 hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange dark:hover:bg-foreground-dark/30`}
        >
          {content}
        </Link>
      ) : (
        <div className={className} title={label}>
          {content}
        </div>
      )}
    </li>
  );
}

/**
 * Attendee avatar grid. The full attendee list is host-only, so we degrade
 * gracefully: when the list is unavailable we still show the count pill using
 * event.attendee_count. Host and verified-account badges have separate meanings.
 */
export function EventAttendees({
  event,
  canManage,
}: {
  event: EventItem;
  canManage?: boolean;
}) {
  const { data } = useEventAttendees(event.slug, !!canManage, {
    limit: 18,
    offset: 0,
    status: 'confirmed',
  });
  // Disabled queries can still contain a previous host's cached response.
  const attendees = (canManage ? data?.attendees || [] : []).filter(
    (a) => a.status === 'confirmed'
  );
  const total =
    (canManage ? data?.total : undefined) ?? event.attendee_count ?? 0;
  const formattedTotal = total.toLocaleString('en-US');

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
          <span className='shrink-0 whitespace-nowrap rounded-full bg-foreground-light/50 dark:bg-foreground-dark/40 px-3 py-1 font-inter text-xs font-medium'>
            {formattedTotal} attending
          </span>
        )}
      </div>

      {shown.length > 0 ? (
        <>
          <ul className='mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,7rem),1fr))] gap-x-3 gap-y-5'>
            {shown.map((a) => {
              const isHost =
                (!!host && a.user_name === host) ||
                (!!event.organizer_account_id &&
                  a.account_id === event.organizer_account_id);
              return (
                <AttendeeIdentity key={a.id} attendee={a} isHost={isHost} />
              );
            })}
          </ul>

          {total > shown.length && (
            <div className='mt-4 flex flex-wrap items-center justify-between gap-3 font-inter text-sm'>
              <p className='text-gray-500 dark:text-gray-400'>
                Showing {shown.length} of {formattedTotal} attendees
              </p>
              <Link
                href={`/events/${event.slug}/manage#manage-attendees`}
                className='inline-flex min-h-11 items-center rounded-md text-brand-orange hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange'
              >
                View all attendees
              </Link>
            </div>
          )}
        </>
      ) : (
        <p className='mt-4 font-inter text-sm text-gray-500 dark:text-gray-400'>
          {total > 0
            ? `${formattedTotal} ${total === 1 ? 'person is' : 'people are'} attending.`
            : 'Be the first to RSVP.'}
        </p>
      )}
    </section>
  );
}
