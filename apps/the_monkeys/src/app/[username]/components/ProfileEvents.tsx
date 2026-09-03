'use client';

import { EventCard, EventEmpty } from '@/components/events/EventCard';
import { Loader } from '@/components/loader';
import { useUserEvents } from '@/hooks/events/useEventQueries';

export function ProfileEvents({ username }: { username: string }) {
  const { data, isLoading, isError } = useUserEvents(username, { limit: 6 });
  const events = data?.events || [];

  if (isLoading) {
    return (
      <div className='flex justify-center py-8'>
        <Loader />
      </div>
    );
  }

  if (isError || events.length === 0) {
    return null;
  }

  return (
    <section className='mt-10'>
      <h6 className='font-dm_sans text-2xl mb-2'>Events</h6>
      {events.length === 0 ? (
        <EventEmpty title='No public events' />
      ) : (
        events.map((event) => <EventCard key={event.slug} event={event} />)
      )}
    </section>
  );
}
