'use client';

import Link from 'next/link';

import Icon from '@/components/icon';
import { EVENTS_ROUTE } from '@/constants/routeConstants';
import { EventItem } from '@/services/events/eventTypes';
import { Button } from '@the-monkeys/ui/atoms/button';

/**
 * Shown in place of the RSVP panel when the viewer is the host or a co-host.
 * A host is always attending their own event, so we surface management actions
 * instead of a registration flow.
 */
export function EventHostPanel({ event }: { event: EventItem }) {
  const going =
    typeof event.attendee_count === 'number' ? event.attendee_count : 0;

  return (
    <div className='rounded-2xl border border-border-light dark:border-border-dark/60 p-5'>
      <div className='flex items-center gap-2 text-brand-orange'>
        <Icon name='RiVerifiedBadge' type='Fill' size={20} />
        <p className='font-dm_sans font-semibold'>You’re hosting this event</p>
      </div>

      <p className='mt-2 font-inter text-sm text-gray-500 dark:text-gray-400'>
        {going} {going === 1 ? 'person is' : 'people are'} going so far.
      </p>

      <div className='mt-4 flex flex-col gap-2'>
        <Button asChild variant='brand' className='w-full'>
          <Link href={`${EVENTS_ROUTE}/${event.slug}/manage`}>
            Manage event
          </Link>
        </Button>
        <Button asChild variant='outline' className='w-full'>
          <Link href={`${EVENTS_ROUTE}/${event.slug}/edit`}>Edit details</Link>
        </Button>
      </div>
    </div>
  );
}
