'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';

import { GroupEmpty } from '@/components/groups/GroupCard';
import { GroupGridCard } from '@/components/groups/GroupGridCard';
import Icon from '@/components/icon';
import { GROUPS_ROUTE, LOGIN_ROUTE } from '@/constants/routeConstants';
import { useGroupList, useUserGroups } from '@/hooks/groups/useGroupQueries';
import { useIPLocation } from '@/hooks/useIPLocation';
import { geoRadiusSteps } from '@/lib/geoSearch';
import { GroupItem, GroupListFilters } from '@/services/groups/groupsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';

type View = 'all' | 'mine';

function GroupGrid({ groups }: { groups: GroupItem[] }) {
  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {groups.map((g) => (
        <GroupGridCard key={g.id || g.slug} group={g} />
      ))}
    </div>
  );
}

function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className='overflow-hidden rounded-xl border border-border-light dark:border-border-dark/40'
        >
          <div className='aspect-[16/9] animate-pulse bg-gray-100 dark:bg-gray-800' />
          <div className='space-y-2 p-4'>
            <div className='h-3 w-1/3 animate-pulse rounded bg-gray-100 dark:bg-gray-800' />
            <div className='h-4 w-4/5 animate-pulse rounded bg-gray-100 dark:bg-gray-800' />
          </div>
        </div>
      ))}
    </div>
  );
}

// Groups browser embedded in the Community hub: an "All / Your groups" toggle
// over the same filter surface. "Your groups" lists every status you organize
// or belong to (drafts included), so unpublished groups are reachable here.
export function CommunityGroups({
  signedIn,
  username,
}: {
  signedIn: boolean;
  username?: string;
}) {
  const [view, setView] = useState<View>('all');
  const [qLive, setQLive] = useState('');
  const [cityLive, setCityLive] = useState('');
  const [topicLive, setTopicLive] = useState('');
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');
  const [topic, setTopic] = useState('');

  // Fallback state for Groups — progressive radius expansion
  const [manualOverride, setManualOverride] = useState(false);
  const ipLocation = useIPLocation();

  const radiusSteps = useMemo(
    () => geoRadiusSteps(ipLocation.country),
    [ipLocation.country]
  );
  const [radiusIndex, setRadiusIndex] = useState(0);
  const atCountryFallback = radiusIndex >= radiusSteps.length;
  const currentRadius = atCountryFallback
    ? 0
    : radiusSteps[Math.min(radiusIndex, radiusSteps.length - 1)];

  // Signed-in members land on "Your groups" so a freshly-created draft (which
  // never appears in the public "All groups" list) is immediately visible.
  // A manual toggle wins from then on.
  const touchedRef = useRef(false);
  useEffect(() => {
    if (signedIn && !touchedRef.current) setView('mine');
  }, [signedIn]);

  const selectView = (next: View) => {
    touchedRef.current = true;
    setView(next);
  };

  // Initialize city label from IP
  useEffect(() => {
    if (
      !ipLocation.isLoading &&
      !manualOverride &&
      ipLocation.city &&
      view === 'all'
    ) {
      setCityLive(ipLocation.city);
      setCity(ipLocation.city);
    }
  }, [ipLocation.isLoading, ipLocation.city, manualOverride, view]);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(qLive);
      if (cityLive !== city) {
        setCity(cityLive);
        setManualOverride(true);
      }
      setTopic(topicLive);
    }, 300);
    return () => clearTimeout(t);
  }, [qLive, cityLive, city, topicLive]);

  const hasCoords = ipLocation.latitude !== 0 && ipLocation.longitude !== 0;
  const filters: GroupListFilters = useMemo(() => {
    const base: GroupListFilters = {
      limit: 30,
      offset: 0,
      q: q.trim() || undefined,
      topics: topic.trim() ? [topic.trim()] : undefined,
    };
    if (manualOverride) {
      base.city = city.trim() || undefined;
      return base;
    }
    if (hasCoords && !atCountryFallback) {
      base.user_lat = ipLocation.latitude;
      base.user_lng = ipLocation.longitude;
      base.radius = currentRadius;
      return base;
    }
    if (ipLocation.countryName) {
      base.country = ipLocation.countryName;
    }
    return base;
  }, [
    q,
    city,
    topic,
    manualOverride,
    hasCoords,
    atCountryFallback,
    currentRadius,
    ipLocation.latitude,
    ipLocation.longitude,
    ipLocation.countryName,
  ]);

  const all = useGroupList(filters, view === 'all');
  const mine = useUserGroups(username, filters, view === 'mine' && signedIn);

  const active = view === 'mine' ? mine : all;
  const groups = active.data?.groups || [];

  useEffect(() => {
    setRadiusIndex(0);
  }, [q, city, topic, manualOverride]);

  useEffect(() => {
    if (
      view === 'all' &&
      all.isSuccess &&
      groups.length === 0 &&
      !manualOverride &&
      hasCoords &&
      radiusIndex < radiusSteps.length
    ) {
      setRadiusIndex((prev) => prev + 1);
    }
  }, [
    all.isSuccess,
    groups.length,
    manualOverride,
    hasCoords,
    radiusIndex,
    view,
    radiusSteps.length,
  ]);

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex rounded-full border border-border-light p-1 dark:border-border-dark/40'>
          {(
            [
              ['all', 'All groups'],
              ['mine', 'Your groups'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type='button'
              onClick={() => selectView(id)}
              aria-pressed={view === id}
              className={`rounded-full px-4 py-1.5 font-inter text-sm font-medium transition-colors ${
                view === id
                  ? 'bg-brand-orange text-white'
                  : 'text-gray-500 hover:text-brand-orange'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <Button asChild variant='brand'>
          <Link href={signedIn ? `${GROUPS_ROUTE}/new` : LOGIN_ROUTE}>
            Start a group
          </Link>
        </Button>
      </div>

      {view === 'all' && (
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Input
            value={qLive}
            onChange={(e) => setQLive(e.target.value)}
            placeholder='Search groups'
            className='sm:flex-1'
          />
          <Input
            value={topicLive}
            onChange={(e) => setTopicLive(e.target.value)}
            placeholder='Topic'
            className='sm:w-44'
          />
          <Input
            value={cityLive}
            onChange={(e) => setCityLive(e.target.value)}
            placeholder='City'
            className='sm:w-44'
          />
        </div>
      )}

      {view === 'mine' && !signedIn ? (
        <GroupEmpty
          title='Log in to see your groups'
          hint='The communities you organize or belong to live here.'
        />
      ) : active.isLoading ? (
        <GridSkeleton />
      ) : active.isError ? (
        <GroupEmpty
          title='Could not load groups'
          hint='Please try again in a moment.'
        />
      ) : groups.length === 0 ? (
        <GroupEmpty
          title={
            view === 'mine' ? 'No groups yet' : 'No groups match your search'
          }
          hint={
            view === 'mine'
              ? 'Start a group and it will show here — even as a draft.'
              : 'Try a different topic or city.'
          }
        />
      ) : (
        <>
          {view === 'mine' && (
            <p className='inline-flex items-center gap-1.5 font-inter text-xs text-gray-500 dark:text-gray-400'>
              <Icon name='RiInformation' size={14} />
              Draft groups are only visible to you until you publish them.
            </p>
          )}
          <GroupGrid groups={groups} />
        </>
      )}
    </div>
  );
}
