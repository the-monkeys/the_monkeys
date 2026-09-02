'use client';

import { useState } from 'react';

import { TextTabs } from '@/components/TextTabs';
import { EventGridCard } from '@/components/events/EventGridCard';
import { Loader } from '@/components/loader';
import { useUserEvents } from '@/hooks/events/useEventQueries';

export function ProfileEvents({ username }: { username: string }) {
  const [when, setWhen] = useState<'upcoming' | 'past'>('upcoming');
  const { data, isLoading, isError } = useUserEvents(username, {
    date: when,
    limit: 12,
  });
  const events = data?.events || [];

  return (
    <div>
      <TextTabs
        aria-label='Profile events'
        value={when}
        onChange={setWhen}
        items={[
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'past', label: 'Past' },
        ]}
      />
      {isLoading ? (
        <div className='flex justify-center py-8'>
          <Loader />
        </div>
      ) : isError || events.length === 0 ? (
        <p className='rounded-xl border border-dashed border-border-light py-12 text-center font-inter text-sm text-gray-500 dark:border-border-dark/40'>
          {when === 'past' ? 'No past events.' : 'No upcoming events.'}
        </p>
      ) : (
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
          {events.map((event) => (
            <EventGridCard key={event.slug} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
