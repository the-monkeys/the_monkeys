'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { CategoryChips } from '@/components/geo/CategoryChips';
import { RadiusChips, RadiusChoice } from '@/components/geo/RadiusChips';
import { GroupCard, GroupEmpty } from '@/components/groups/GroupCard';
import { Loader } from '@/components/loader';
import { GROUPS_ROUTE, LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { useGroupList, useUserGroups } from '@/hooks/groups/useGroupQueries';
import { useIPLocation } from '@/hooks/useIPLocation';
import {
  defaultRadiusStepIndex,
  geoRadiusSteps,
  nearMeQuery,
} from '@/lib/geoSearch';
import { GroupListFilters } from '@/services/groups/groupsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';

type Tab = 'discover' | 'mine';

export default function GroupsPageClient() {
  const { data: session } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('discover');
  const [qLive, setQLive] = useState('');
  const [cityLive, setCityLive] = useState('');
  const [topicLive, setTopicLive] = useState('');
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');
  const [topic, setTopic] = useState('');
  const ipLocation = useIPLocation();
  const radiusSteps = useMemo(() => geoRadiusSteps(), []);
  const [radiusIndex, setRadiusIndex] = useState(() =>
    defaultRadiusStepIndex()
  );
  const [nationwide, setNationwide] = useState(false);
  const currentRadius =
    radiusSteps[Math.min(radiusIndex, radiusSteps.length - 1)];

  // Debounce every free-text filter behind a single 300ms window.
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(qLive);
      setCity(cityLive);
      setTopic(topicLive);
    }, 300);
    return () => clearTimeout(t);
  }, [qLive, cityLive, topicLive]);

  const typedCity = city.trim();
  const filters: GroupListFilters = useMemo(() => {
    const base: GroupListFilters = {
      limit: 30,
      offset: 0,
      q: q.trim() || undefined,
      topics: topic.trim() ? [topic.trim()] : undefined,
    };
    if (typedCity) {
      base.city = typedCity;
      return base;
    }
    if (nationwide) return base;
    const geo = nearMeQuery({
      lat: ipLocation.latitude,
      lng: ipLocation.longitude,
      radiusKm: currentRadius,
    });
    const ipCity = ipLocation.city.trim() || undefined;
    if (geo.radius) return { ...base, ...geo, city: ipCity };
    return base;
  }, [
    q,
    topic,
    typedCity,
    nationwide,
    currentRadius,
    ipLocation.latitude,
    ipLocation.longitude,
  ]);

  const applyRadius = (v: RadiusChoice) => {
    setCity('');
    setCityLive('');
    if (v === 'everywhere') {
      setNationwide(true);
      return;
    }
    setNationwide(false);
    const i = radiusSteps.indexOf(v);
    if (i >= 0) setRadiusIndex(i);
  };

  const waitingGeo =
    tab === 'discover' && ipLocation.isLoading && !nationwide && !typedCity;
  const discover = useGroupList(filters, tab === 'discover' && !waitingGeo);
  const mine = useUserGroups(
    session?.username,
    filters,
    tab === 'mine' && !!session
  );

  const active = tab === 'mine' ? mine : discover;
  const groups = active.data?.groups || [];

  return (
    <div className='mx-auto max-w-3xl'>
      <header className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6'>
        <div>
          <p className='font-inter font-bold text-[11px] text-brand-orange uppercase tracking-[0.22em]'>
            Community
          </p>
          <h1 className='font-newsreader font-bold text-4xl md:text-5xl mt-1'>
            Groups
          </h1>
          <p className='mt-2 font-inter text-sm text-gray-500 dark:text-gray-400'>
            Find your people. Join communities and never miss their events.
          </p>
        </div>
        <Button asChild variant='brand'>
          <Link href={session ? `${GROUPS_ROUTE}/new` : LOGIN_ROUTE}>
            Start a group
          </Link>
        </Button>
      </header>

      <div className='flex gap-1 mb-4 border-b border-border-light dark:border-border-dark/40'>
        {(
          [
            ['discover', 'Discover'],
            ['mine', 'Your groups'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type='button'
            onClick={() => {
              if (id === 'mine' && !session) {
                router.push(LOGIN_ROUTE);
                return;
              }
              setTab(id);
            }}
            className={`px-3 py-2 text-sm font-inter ${
              tab === id
                ? 'border-b-2 border-brand-orange font-medium'
                : 'text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'discover' && (
        <div className='flex flex-col sm:flex-row gap-3 mb-6'>
          <Input
            value={qLive}
            onChange={(e) => setQLive(e.target.value)}
            placeholder='Search groups'
            className='sm:flex-1'
          />
          <Input
            value={cityLive}
            onChange={(e) => {
              setCityLive(e.target.value);
              setNationwide(false);
            }}
            placeholder='City'
            className='sm:w-40'
          />
        </div>
      )}
      {tab === 'discover' && (
        <div className='mb-6 space-y-3'>
          <CategoryChips
            selected={topic ? [topic] : []}
            onToggle={(tag) => {
              const next = topic === tag ? '' : tag;
              setTopic(next);
              setTopicLive(next);
            }}
          />
          {!typedCity && (
            <RadiusChips
              value={nationwide ? 'everywhere' : currentRadius}
              onChange={applyRadius}
            />
          )}
        </div>
      )}

      {tab === 'mine' && !session && (
        <GroupEmpty
          title='Log in to see your groups'
          hint='The communities you organize or belong to live here.'
        />
      )}

      {(waitingGeo || active.isLoading) && (
        <div className='flex justify-center py-16'>
          <Loader size={28} />
        </div>
      )}

      {active.isError && (
        <GroupEmpty
          title='Could not load groups'
          hint='Please try again in a moment.'
        />
      )}

      {!waitingGeo &&
        !active.isLoading &&
        !active.isError &&
        groups.length === 0 &&
        tab === 'mine' &&
        session && (
          <GroupEmpty
            title='You have not joined a group yet'
            hint='Discover communities and join the ones you love.'
          />
        )}

      {!waitingGeo &&
        !active.isLoading &&
        !active.isError &&
        groups.length === 0 &&
        tab === 'discover' && (
          <GroupEmpty title='No groups yet' hint='Be the first to start one.' />
        )}

      {groups.map((group) => (
        <GroupCard key={group.id || group.slug} group={group} />
      ))}
      {tab === 'discover' &&
        discover.isFetching &&
        !discover.isLoading &&
        groups.length > 0 && (
          <p className='mt-3 font-inter text-sm text-gray-500'>Updating…</p>
        )}
    </div>
  );
}
