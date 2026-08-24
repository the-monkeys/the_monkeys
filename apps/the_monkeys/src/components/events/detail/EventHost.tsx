import Link from 'next/link';

import Icon from '@/components/icon';
import { ProfileFrame, ProfileImage } from '@/components/profileImage';
import { EventItem } from '@/services/events/eventTypes';

/**
 * Host / organizer badge. Consumes both the new event host schema
 * (organizer_username) and, when linked, the group that owns the event.
 */
export function EventHost({ event }: { event: EventItem }) {
  const username = event.organizer_username;
  const coHosts = event.co_host_usernames || [];

  return (
    <section className='rounded-2xl border border-border-light dark:border-border-dark/60 p-5'>
      <div className='flex items-center gap-4'>
        <ProfileFrame className='h-12 w-12 shrink-0'>
          {username ? (
            <ProfileImage username={username} />
          ) : (
            <Icon name='RiUser' />
          )}
        </ProfileFrame>

        <div className='min-w-0 flex-1'>
          <p className='font-inter text-xs uppercase tracking-wider text-gray-500'>
            Hosted by
          </p>
          {username ? (
            <Link
              href={`/${username}`}
              className='font-dm_sans font-semibold hover:text-brand-orange'
            >
              @{username}
            </Link>
          ) : (
            <span className='font-dm_sans font-semibold'>
              Monkeys community
            </span>
          )}

          {event.group_slug && (
            <p className='mt-0.5 font-inter text-sm text-gray-500 dark:text-gray-400'>
              <Icon
                name='RiGroup'
                size={14}
                className='mr-1 inline align-text-bottom'
              />
              <Link
                href={`/groups/${event.group_slug}`}
                className='hover:text-brand-orange'
              >
                {event.group_name || event.group_slug}
              </Link>
            </p>
          )}
        </div>
      </div>

      {coHosts.length > 0 && (
        <div className='mt-4 flex flex-wrap items-center gap-2 border-t border-border-light dark:border-border-dark/40 pt-4'>
          <span className='font-inter text-xs text-gray-500'>Co-hosts:</span>
          {coHosts.map((c) => (
            <Link
              key={c}
              href={`/${c}`}
              className='font-inter text-xs text-brand-orange hover:underline'
            >
              @{c}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
