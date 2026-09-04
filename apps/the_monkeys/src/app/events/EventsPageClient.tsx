'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { EventCard, EventEmpty } from '@/components/events/EventCard';
import { CommunityGroups } from '@/components/events/discover/CommunityGroups';
import { EventsDiscover } from '@/components/events/discover/EventsDiscover';
import { Loader } from '@/components/loader';
import { EVENTS_ROUTE, LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import {
  useAttendingEvents,
  useUserEvents,
} from '@/hooks/events/useEventQueries';
import { ListFilters } from '@/services/events/eventTypes';
import { Button } from '@the-monkeys/ui/atoms/button';

type Tab = 'discover' | 'groups' | 'going' | 'hosting';

export default function EventsPageClient() {
  const { data: session } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('discover');

  const filters: ListFilters = useMemo(() => ({ limit: 30, offset: 0 }), []);

  const going = useAttendingEvents(filters, tab === 'going' && !!session);
  const hosting = useUserEvents(
    session?.username,
    filters,
    tab === 'hosting' && !!session
  );

  const active = tab === 'hosting' ? hosting : going;
  const events = active.data?.events || [];

  return (
    <div className='mx-auto max-w-6xl'>
      <div className='mb-8 flex gap-1 border-b border-border-light dark:border-border-dark/40'>
        {(
          [
            ['discover', 'Discover'],
            ['groups', 'Groups'],
            ['going', 'Going'],
            ['hosting', 'Hosting'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type='button'
            onClick={() => {
              if ((id === 'going' || id === 'hosting') && !session) {
                router.push(LOGIN_ROUTE);
                return;
              }
              setTab(id);
            }}
            className={`px-3 py-2 font-inter text-sm ${
              tab === id
                ? 'border-b-2 border-brand-orange font-medium'
                : 'text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'discover' && <EventsDiscover signedIn={!!session} />}

      {tab === 'groups' && (
        <CommunityGroups signedIn={!!session} username={session?.username} />
      )}

      {(tab === 'going' || tab === 'hosting') && (
        <div className='mx-auto max-w-3xl'>
          <header className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='font-inter text-[11px] font-bold uppercase tracking-[0.22em] text-brand-orange'>
                Your events
              </p>
              <h1 className='mt-1 font-newsreader text-3xl font-bold sm:text-4xl'>
                {tab === 'going' ? 'Going' : 'Hosting'}
              </h1>
            </div>
            <Button asChild variant='brand'>
              <Link href={session ? `${EVENTS_ROUTE}/new` : LOGIN_ROUTE}>
                Create event
              </Link>
            </Button>
          </header>

          {!session && (
            <EventEmpty
              title='Log in to see this list'
              hint='Your tickets and hosted events live here.'
            />
          )}

          {session && active.isLoading && (
            <div className='flex justify-center py-16'>
              <Loader size={28} />
            </div>
          )}

          {session && active.isError && (
            <EventEmpty
              title='Could not load events'
              hint='Please try again in a moment.'
            />
          )}

          {session &&
            !active.isLoading &&
            !active.isError &&
            events.length === 0 && (
              <EventEmpty
                title={
                  tab === 'going'
                    ? 'You are not going to any event yet'
                    : 'You have not hosted an event yet'
                }
              />
            )}

          {session &&
            events.map((event) => (
              <EventCard key={event.id || event.slug} event={event} />
            ))}
        </div>
      )}
    </div>
  );
}
