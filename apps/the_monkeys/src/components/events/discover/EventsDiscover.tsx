'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';

import { EventGridCard } from '@/components/events/EventGridCard';
import { CategoryChips } from '@/components/geo/CategoryChips';
import { RadiusChips, RadiusChoice } from '@/components/geo/RadiusChips';
import { GroupGridCard } from '@/components/groups/GroupGridCard';
import Icon from '@/components/icon';
import {
  EVENTS_ROUTE,
  GROUPS_ROUTE,
  LOGIN_ROUTE,
} from '@/constants/routeConstants';
import { useEventList } from '@/hooks/events/useEventQueries';
import { useGroupList } from '@/hooks/groups/useGroupQueries';
import { useIPLocation } from '@/hooks/useIPLocation';
import { uniqueSeriesEvents } from '@/lib/eventTime';
import {
  defaultRadiusStepIndex,
  geoRadiusSteps,
  nearMeQuery,
} from '@/lib/geoSearch';
import { EventItem, ListFilters } from '@/services/events/eventTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@the-monkeys/ui/atoms/select';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How do I join an event?',
    a: 'Open any event and hit RSVP. Free events confirm instantly; paid events take you through secure checkout.',
  },
  {
    q: 'How do I start my own community?',
    a: 'Create a group, set your topic and city, then publish. You can host recurring events and manage members from your dashboard.',
  },
  {
    q: 'Are events online or in person?',
    a: 'Both. Use the Online, In person, and Hybrid filters to find the format that fits you.',
  },
  {
    q: 'Is it free to attend?',
    a: 'Many meetups are free. Paid events show the price up front, with no hidden fees at checkout.',
  },
];

// -----------------------------------------------------------------------------
// Small presentational helpers
// -----------------------------------------------------------------------------

function SectionHeader({
  eyebrow,
  title,
  action,
  subtitle,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className='mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
      <div className='shrink-0'>
        {eyebrow && (
          <p className='font-inter text-[11px] font-bold uppercase tracking-[0.2em] text-brand-orange'>
            {eyebrow}
          </p>
        )}
        <h2 className='mt-1 font-newsreader text-2xl font-bold sm:text-3xl text-text-light dark:text-text-dark'>
          {title}
        </h2>
        {subtitle && <div className='mt-1'>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function GridSkeleton({ count = 4 }: { count?: number }) {
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
            <div className='h-3 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-gray-800' />
          </div>
        </div>
      ))}
    </div>
  );
}

const EventGrid = memo(function EventGrid({
  events,
  updating,
}: {
  events: EventItem[];
  updating?: boolean;
}) {
  return (
    <div className='relative' aria-busy={updating || undefined}>
      {updating && (
        <p className='mb-3 font-inter text-sm text-gray-500'>Updating…</p>
      )}
      <div
        className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
          updating ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        {uniqueSeriesEvents(events).map((event) => (
          <EventGridCard key={event.id || event.slug} event={event} />
        ))}
      </div>
    </div>
  );
});

// -----------------------------------------------------------------------------
// Main landing
// -----------------------------------------------------------------------------

export function EventsDiscover({ signedIn }: { signedIn: boolean }) {
  const [qLive, setQLive] = useState('');
  const [q, setQ] = useState('');

  const [locationLive, setLocationLive] = useState('');
  const [location, setLocation] = useState('');

  // Track whether the user has manually typed a location (disables auto-radius)
  const [manualOverride, setManualOverride] = useState(false);
  const ipLocation = useIPLocation();

  const [activeTag, setActiveTag] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);
  const [customTagLive, setCustomTagLive] = useState('');
  const [dateFilter, setDateFilter] = useState<
    'upcoming' | 'this-week' | 'this-month'
  >('upcoming');
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'in-person' | 'online' | 'hybrid'
  >('all');
  const [sortBy, setSortBy] = useState<
    'soonest' | 'popular' | 'newest' | 'nearest'
  >('soonest');

  const gridRef = useRef<HTMLDivElement | null>(null);
  const locationInputRef = useRef<HTMLInputElement | null>(null);

  const radiusSteps = useMemo(() => geoRadiusSteps(), []);
  const [radiusIndex, setRadiusIndex] = useState(() =>
    defaultRadiusStepIndex()
  );
  const [radiusLocked, setRadiusLocked] = useState(false);
  const [nationwide, setNationwide] = useState(false);
  const currentRadius =
    radiusSteps[Math.min(radiusIndex, radiusSteps.length - 1)];

  // Initialize location label from IP when it loads
  useEffect(() => {
    if (!ipLocation.isLoading && !manualOverride && ipLocation.city) {
      setLocationLive(ipLocation.city);
      setLocation(ipLocation.city);
    }
  }, [ipLocation.isLoading, ipLocation.city, manualOverride]);

  // Handle manual user input
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(qLive);
      if (locationLive !== location) {
        setLocation(locationLive);
        setManualOverride(true); // User typed something, disable auto-radius
      }
    }, 300);
    return () => clearTimeout(t);
  }, [qLive, locationLive, location]);

  useEffect(() => {
    if (!moreOpen) return;
    const t = setTimeout(() => {
      const tag = customTagLive.trim().toLowerCase();
      if (tag) setActiveTag(tag);
    }, 300);
    return () => clearTimeout(t);
  }, [moreOpen, customTagLive]);

  const hasCoords = ipLocation.latitude !== 0 && ipLocation.longitude !== 0;
  const pinActive = !manualOverride && !nationwide && hasCoords;
  const filters: ListFilters = useMemo(() => {
    const geo = nearMeQuery({
      lat: ipLocation.latitude,
      lng: ipLocation.longitude,
      radiusKm: currentRadius,
      nationwide: nationwide || manualOverride,
    });
    const cityLabel = location.trim() || ipLocation.city.trim();
    return {
      limit: 12,
      offset: 0,
      q: q.trim() || undefined,
      // Send the city with near-me so unpinned local events still match.
      location: !nationwide && cityLabel ? cityLabel : undefined,
      tags: activeTag || undefined,
      type:
        typeFilter === 'all'
          ? undefined
          : ((typeFilter === 'in-person'
              ? 'in_person'
              : typeFilter === 'online'
                ? 'virtual'
                : typeFilter) as ListFilters['type']),
      date: dateFilter,
      sort:
        sortBy === 'soonest'
          ? undefined
          : sortBy === 'nearest' && !pinActive
            ? undefined
            : sortBy,
      ...geo,
    };
  }, [
    q,
    location,
    activeTag,
    typeFilter,
    dateFilter,
    sortBy,
    manualOverride,
    nationwide,
    pinActive,
    currentRadius,
    ipLocation.latitude,
    ipLocation.longitude,
  ]);

  const geoReady = !ipLocation.isLoading || nationwide || manualOverride;
  const popular = useEventList(filters, geoReady);
  const nearbyGroups = useMemo(() => {
    if (manualOverride) return { city: location.trim() || undefined };
    if (nationwide) return {};
    const geo = nearMeQuery({
      lat: ipLocation.latitude,
      lng: ipLocation.longitude,
      radiusKm: currentRadius,
    });
    const city = location.trim() || ipLocation.city.trim() || undefined;
    if (geo.radius) return { ...geo, city };
    if (ipLocation.countryName) return { country: ipLocation.countryName };
    return { city };
  }, [
    manualOverride,
    nationwide,
    location,
    currentRadius,
    ipLocation.latitude,
    ipLocation.longitude,
    ipLocation.countryName,
  ]);
  const communities = useGroupList({ limit: 8, ...nearbyGroups }, geoReady);

  const popularEvents = popular.data?.events || [];
  const groups = communities.data?.groups || [];
  const nearbyInPerson = popularEvents.filter(
    (e) => e.event_type === 'in_person'
  );
  const lookingForInPerson = typeFilter === 'all' || typeFilter === 'in-person';

  useEffect(() => {
    if (!radiusLocked) setRadiusIndex(defaultRadiusStepIndex());
  }, [
    q,
    activeTag,
    typeFilter,
    dateFilter,
    manualOverride,
    nationwide,
    radiusLocked,
  ]);

  // Widen toward 100 km while no in-person events are in range.
  // Virtual/hybrid are already included globally and must not freeze the radius.
  useEffect(() => {
    if (
      lookingForInPerson &&
      popular.isSuccess &&
      !popular.isFetching &&
      nearbyInPerson.length === 0 &&
      !manualOverride &&
      !nationwide &&
      !radiusLocked &&
      hasCoords &&
      currentRadius > 0 &&
      radiusIndex < radiusSteps.length - 1
    ) {
      setRadiusIndex((prev) => prev + 1);
    }
  }, [
    lookingForInPerson,
    popular.isSuccess,
    popular.isFetching,
    nearbyInPerson.length,
    manualOverride,
    nationwide,
    radiusLocked,
    hasCoords,
    currentRadius,
    radiusIndex,
    radiusSteps.length,
  ]);

  const applyTag = (tag: string) => {
    setMoreOpen(false);
    setCustomTagLive('');
    setActiveTag((prev) => (prev === tag ? '' : tag));
    // Reveal the filtered grid.
    requestAnimationFrame(() =>
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    );
  };

  const hasActiveFilters =
    !!activeTag || !!q.trim() || manualOverride || nationwide;
  const displayLocation = nationwide ? 'everywhere' : location.trim() || 'you';

  const applyRadius = (v: RadiusChoice) => {
    setRadiusLocked(true);
    setManualOverride(false);
    if (v === 'everywhere') {
      setNationwide(true);
      return;
    }
    setNationwide(false);
    const i = radiusSteps.indexOf(v);
    if (i >= 0) setRadiusIndex(i);
    if (ipLocation.city) {
      setLocation(ipLocation.city);
      setLocationLive(ipLocation.city);
    }
  };

  return (
    <div className='space-y-14 sm:space-y-20'>
      {/* ---- Hero: search + category chips ---- */}
      <section className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-orange to-[#E03A1F] px-5 py-10 sm:px-10 sm:py-14 shadow-md'>
        <div className='relative max-w-4xl'>
          {/* Eyebrow */}
          <p className='font-inter text-[11px] font-bold uppercase tracking-[0.22em] text-white/80'>
            Community
          </p>

          {/* Headline */}
          <h1 className='mt-3 font-newsreader text-3xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.5rem] text-white'>
            Find your people. Join the next meetup.
          </h1>

          {/* Supporting copy */}
          <p className='mt-3 max-w-xl font-inter text-sm text-white/90 sm:text-base'>
            Talks, workshops, and live sessions happening near you and online.
          </p>

          {/* Search controls */}
          <div className='mt-7 flex flex-col gap-3 sm:flex-row sm:items-end'>
            {/* Event/topic search — largest */}
            <label className='relative flex-1 min-w-0'>
              <span className='sr-only'>Search events or topics</span>
              <span className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                <Icon name='RiSearch' size={18} />
              </span>
              <Input
                value={qLive}
                onChange={(e) => setQLive(e.target.value)}
                placeholder='Search events or topics'
                className='h-12 w-full rounded-xl border-border-light bg-white pl-11 text-text-light placeholder:text-gray-400 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 dark:border-border-dark/40 dark:bg-background-dark dark:text-text-dark'
              />
            </label>

            {/* Location selector — secondary */}
            <label className='relative w-full shrink-0 sm:w-52'>
              <span className='sr-only'>Location</span>
              <span className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                <Icon name='RiMapPinUser' size={18} />
              </span>
              <Input
                ref={locationInputRef}
                value={locationLive}
                onChange={(e) => {
                  setLocationLive(e.target.value);
                  setNationwide(false);
                }}
                placeholder={locationLive ? locationLive : 'City or online'}
                className='h-12 w-full rounded-xl border-border-light bg-white pl-11 text-text-light placeholder:text-gray-400 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 dark:border-border-dark/40 dark:bg-background-dark dark:text-text-dark'
              />
            </label>
          </div>
          <div className='mt-3'>
            <RadiusChips
              variant='hero'
              value={nationwide ? 'everywhere' : currentRadius}
              onChange={applyRadius}
            />
          </div>

          {/* Category chips - transparent with white text/border */}
          <div className='mt-6'>
            <CategoryChips
              variant='hero'
              selected={activeTag ? [activeTag] : []}
              onToggle={applyTag}
            />
            <div className='mt-2 flex flex-wrap items-center gap-2'>
              <button
                type='button'
                aria-pressed={moreOpen}
                onClick={() => setMoreOpen((v) => !v)}
                className='min-h-11 whitespace-nowrap rounded-full border border-white/30 px-4 py-2 font-inter text-sm text-white/80 transition-colors duration-150 hover:border-white/60 hover:text-white'
              >
                More
              </button>
              {moreOpen && (
                <input
                  aria-label='Custom tag'
                  value={customTagLive}
                  onChange={(e) => setCustomTagLive(e.target.value)}
                  placeholder='Any tag'
                  className='min-h-11 min-w-[10rem] rounded-full border border-white/30 bg-transparent px-4 font-inter text-sm text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Popular events ---- */}
      <section ref={gridRef} className='scroll-mt-24'>
        <SectionHeader
          eyebrow="What's around"
          title={
            <span className='flex items-center gap-2'>
              <span>Popular events near</span>
              <span className='text-brand-orange'>{displayLocation}</span>
              {!hasActiveFilters && (
                <button
                  type='button'
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setTimeout(() => locationInputRef.current?.focus(), 500);
                  }}
                  className='ml-2 inline-flex items-center gap-1 font-inter text-[15px] font-medium text-gray-400 hover:text-brand-orange'
                >
                  Change
                  <Icon name='RiArrowDownS' size={16} />
                </button>
              )}
            </span>
          }
          action={
            <div className='flex flex-wrap items-center gap-2'>
              {hasActiveFilters && (
                <button
                  type='button'
                  onClick={() => {
                    setActiveTag('');
                    setMoreOpen(false);
                    setCustomTagLive('');
                    setQ('');
                    setQLive('');
                    setLocation('');
                    setLocationLive('');
                    setManualOverride(false);
                    setNationwide(false);
                    setRadiusLocked(false);
                    setRadiusIndex(defaultRadiusStepIndex());
                  }}
                  className='inline-flex items-center gap-1 font-inter text-sm font-medium text-brand-orange'
                >
                  Clear
                  <Icon name='RiClose' size={16} />
                </button>
              )}
              <Select
                value={dateFilter}
                onValueChange={(v) => setDateFilter(v as typeof dateFilter)}
              >
                <SelectTrigger className='h-9 w-auto rounded-full bg-white border border-border-light px-3.5 font-inter text-sm text-text-light hover:bg-gray-50 dark:border-border-dark/40 dark:bg-background-dark dark:text-text-dark dark:hover:bg-white/5'>
                  <div className='flex items-center gap-2'>
                    <Icon
                      name='RiCalendar'
                      size={16}
                      className='text-gray-500'
                    />
                    <SelectValue placeholder='Upcoming' />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='upcoming'>Upcoming</SelectItem>
                  <SelectItem value='this-week'>This week</SelectItem>
                  <SelectItem value='this-month'>This month</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={typeFilter}
                onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}
              >
                <SelectTrigger className='h-9 w-auto rounded-full bg-white border border-border-light px-3.5 font-inter text-sm text-text-light hover:bg-gray-50 dark:border-border-dark/40 dark:bg-background-dark dark:text-text-dark dark:hover:bg-white/5'>
                  <div className='flex items-center gap-2'>
                    <Icon name='RiUser' size={16} className='text-gray-500' />
                    <SelectValue placeholder='All' />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='in-person'>In person</SelectItem>
                  <SelectItem value='virtual'>Online</SelectItem>
                  <SelectItem value='hybrid'>Hybrid</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as typeof sortBy)}
              >
                <SelectTrigger className='h-9 w-auto rounded-full bg-white border border-border-light px-3.5 font-inter text-sm text-text-light hover:bg-gray-50 dark:border-border-dark/40 dark:bg-background-dark dark:text-text-dark dark:hover:bg-white/5'>
                  <span className='mr-1 text-gray-500'>Sort:</span>
                  <SelectValue placeholder='Soonest' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='soonest'>Soonest</SelectItem>
                  <SelectItem value='popular'>Most popular</SelectItem>
                  <SelectItem value='newest'>Newest</SelectItem>
                  {pinActive && (
                    <SelectItem value='nearest'>Nearest</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          }
        />
        {!geoReady || popular.isLoading ? (
          <GridSkeleton count={8} />
        ) : popular.isError ? (
          <p className='py-10 text-center font-inter text-sm text-gray-500'>
            Could not load events. Please try again.
          </p>
        ) : popularEvents.length === 0 ? (
          <div className='rounded-2xl border border-dashed border-border-light bg-black/[0.015] px-6 py-16 text-center dark:border-border-dark/40 dark:bg-white/[0.02]'>
            <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange'>
              <Icon name='RiCalendar' size={26} />
            </div>
            <h3 className='font-newsreader text-2xl font-bold'>
              {nationwide
                ? 'No matching events yet'
                : location.trim()
                  ? `No events around ${location.trim()} yet`
                  : 'No events yet'}
            </h3>
            <p className='mx-auto mt-2 max-w-sm font-inter text-sm text-gray-500'>
              This corner of the community is just getting started. Host the
              first meetup and people nearby will find it right here.
            </p>
            <div className='mt-6 flex flex-wrap justify-center gap-3'>
              <Button asChild variant='brand' className='h-11'>
                <Link href={signedIn ? `${EVENTS_ROUTE}/new` : LOGIN_ROUTE}>
                  Host an event
                </Link>
              </Button>
              {location.trim() && (
                <Button
                  variant='outline'
                  className='h-11'
                  onClick={() => {
                    setNationwide(true);
                    setRadiusLocked(true);
                    setManualOverride(false);
                  }}
                >
                  Show everywhere
                </Button>
              )}
            </div>
          </div>
        ) : (
          <EventGrid
            events={popularEvents}
            updating={popular.isFetching && !popular.isLoading}
          />
        )}
      </section>

      {/* ---- Bottom Feature Strip ---- */}
      <section className='grid grid-cols-1 gap-6 rounded-2xl border border-border-light bg-gray-50/50 p-6 dark:border-border-dark/40 dark:bg-black/20 sm:grid-cols-2 lg:grid-cols-4 sm:p-8'>
        <div className='flex items-center gap-4'>
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange'>
            <Icon name='RiCompass' size={24} />
          </div>
          <div>
            <h3 className='font-inter text-sm font-bold text-text-light dark:text-text-dark'>
              Discover events
            </h3>
            <p className='font-inter text-[13px] text-gray-500'>
              tailored to you
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange'>
            <Icon name='RiGroup' size={24} />
          </div>
          <div>
            <h3 className='font-inter text-sm font-bold text-text-light dark:text-text-dark'>
              Meet people
            </h3>
            <p className='font-inter text-[13px] text-gray-500'>
              who share your interests
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange'>
            <Icon name='RiBookShelf' size={24} />
          </div>
          <div>
            <h3 className='font-inter text-sm font-bold text-text-light dark:text-text-dark'>
              Learn and grow
            </h3>
            <p className='font-inter text-[13px] text-gray-500'>together</p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange'>
            <Icon name='RiCalendar' size={24} />
          </div>
          <div>
            <h3 className='font-inter text-sm font-bold text-text-light dark:text-text-dark'>
              Host events
            </h3>
            <p className='font-inter text-[13px] text-gray-500'>
              and build community
            </p>
          </div>
        </div>
      </section>

      {/* ---- Popular communities ---- */}
      <section>
        <SectionHeader
          eyebrow='Communities'
          title={
            location.trim() && !nationwide
              ? `Popular communities in ${location.trim()}`
              : nationwide
                ? 'Popular communities everywhere'
                : 'Popular communities'
          }
          action={
            <Link
              href={GROUPS_ROUTE}
              className='inline-flex items-center gap-1 font-inter text-sm font-medium text-brand-orange'
            >
              See all
              <Icon name='RiArrowRight' size={16} />
            </Link>
          }
        />
        {!geoReady || communities.isLoading ? (
          <GridSkeleton count={4} />
        ) : groups.length === 0 ? (
          <p className='rounded-xl border border-dashed border-border-light py-12 text-center font-inter text-sm text-gray-500 dark:border-border-dark/40'>
            No communities yet. Be the first to start one.
          </p>
        ) : (
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {groups.map((g) => (
              <GroupGridCard key={g.id || g.slug} group={g} />
            ))}
          </div>
        )}
      </section>

      {/* ---- FAQ accordion (native details/summary) ---- */}
      <section>
        <SectionHeader eyebrow='Good to know' title='Community FAQ' />
        <div className='divide-y divide-border-light overflow-hidden rounded-xl border border-border-light dark:divide-border-dark/40 dark:border-border-dark/40'>
          {FAQS.map((f) => (
            <details key={f.q} className='group px-5'>
              <summary className='flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-inter font-medium text-text-light marker:hidden dark:text-text-dark'>
                {f.q}
                <span className='shrink-0 text-brand-orange transition-transform duration-200 group-open:rotate-180'>
                  <Icon name='RiArrowDownS' size={20} />
                </span>
              </summary>
              <p className='pb-4 font-inter text-sm text-gray-500 dark:text-gray-400'>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
