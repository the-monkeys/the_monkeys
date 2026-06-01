'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';

import { EventGridCard } from '@/components/events/EventGridCard';
import { GroupGridCard } from '@/components/groups/GroupGridCard';
import Icon from '@/components/icon';
import {
  EVENTS_ROUTE,
  GROUPS_ROUTE,
  LOGIN_ROUTE,
} from '@/constants/routeConstants';
import { useEventList } from '@/hooks/events/useEventQueries';
import { useGroupList } from '@/hooks/groups/useGroupQueries';
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

// Category pills map to the backend `tags` filter (GET /events binds `tags`).
const CATEGORIES: { label: string; tag: string }[] = [
  { label: 'Networking', tag: 'networking' },
  { label: 'Tech & AI', tag: 'tech' },
  { label: 'Writing & Storytelling', tag: 'writing' },
  { label: 'Outdoor', tag: 'outdoor' },
  { label: 'Sports & Hobbies', tag: 'sports' },
];

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

function EventGrid({ events }: { events: EventItem[] }) {
  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {events.map((event) => (
        <EventGridCard key={event.id || event.slug} event={event} />
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Main landing
// -----------------------------------------------------------------------------

export function EventsDiscover({ signedIn }: { signedIn: boolean }) {
  const [qLive, setQLive] = useState('');
  const [q, setQ] = useState('');
  const [locationLive, setLocationLive] = useState('');
  const [location, setLocation] = useState('');
  const [activeTag, setActiveTag] = useState('');

  const [dateFilter, setDateFilter] = useState<
    'this-week' | 'this-month' | 'all'
  >('this-week');
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'in-person' | 'online' | 'hybrid'
  >('all');
  const [sortBy, setSortBy] = useState<'soonest' | 'popular' | 'newest'>(
    'soonest'
  );

  const gridRef = useRef<HTMLDivElement | null>(null);
  const locationInputRef = useRef<HTMLInputElement | null>(null);

  // NOTE: We deliberately do NOT auto-fill the location filter from the browser
  // timezone. Timezone is region-level (e.g. "Asia/Calcutta" for all of India)
  // and applying it as a hard filter hid every online/virtual event and every
  // group outside that city — i.e. the whole platform looked empty. Location is
  // now an explicit, opt-in refinement the user types in.
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(qLive);
      setLocation(locationLive);
    }, 300);
    return () => clearTimeout(t);
  }, [qLive, locationLive]);

  // Filtered grid — reflects search + active category.
  const filters: ListFilters = useMemo(
    () => ({
      limit: 12,
      offset: 0,
      q: q.trim() || undefined,
      location: location.trim() || undefined,
      tags: activeTag || undefined,
    }),
    [q, location, activeTag]
  );

  const popular = useEventList(filters);
  const communities = useGroupList({
    limit: 8,
    city: location.trim() || undefined,
  });

  const popularEvents = popular.data?.events || [];
  const groups = communities.data?.groups || [];

  const applyTag = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? '' : tag));
    // Reveal the filtered grid.
    requestAnimationFrame(() =>
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    );
  };

  const hasActiveFilters = !!activeTag || !!q.trim() || !!location.trim();
  const displayLocation = location.trim() || 'Bengaluru';

  return (
    <div className='space-y-14 sm:space-y-20'>
      {/* ---- Hero: search + category chips ---- */}
      <section className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-orange to-[#E03A1F] px-5 py-10 sm:px-10 sm:py-14 shadow-md'>
        {/* Create Button positioned in top right of hero */}
        <div className='absolute right-5 top-5 z-10 sm:right-8 sm:top-8'>
          <Button
            asChild
            className='h-9 sm:h-10 px-5 rounded-full bg-white font-semibold text-text-light shadow-sm hover:bg-gray-100 transition-colors'
          >
            <Link href={signedIn ? `${EVENTS_ROUTE}/new` : LOGIN_ROUTE}>
              Create event
            </Link>
          </Button>
        </div>

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
                onChange={(e) => setLocationLive(e.target.value)}
                placeholder={locationLive ? locationLive : 'City or online'}
                className='h-12 w-full rounded-xl border-border-light bg-white pl-11 text-text-light placeholder:text-gray-400 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 dark:border-border-dark/40 dark:bg-background-dark dark:text-text-dark'
              />
            </label>
          </div>

          {/* Category chips - transparent with white text/border */}
          <div className='-mx-1 mt-6 flex flex-wrap gap-2'>
            {CATEGORIES.map((c) => (
              <button
                key={c.tag}
                type='button'
                onClick={() => applyTag(c.tag)}
                aria-pressed={activeTag === c.tag}
                className={`whitespace-nowrap rounded-full border px-4 py-2 font-inter text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                  activeTag === c.tag
                    ? 'border-white bg-white text-brand-orange shadow-sm'
                    : 'border-white/30 text-white hover:border-white/60 hover:bg-white/10'
                }`}
              >
                {c.label}
              </button>
            ))}
            <button
              type='button'
              className='whitespace-nowrap rounded-full border border-white/30 px-4 py-2 font-inter text-sm text-white/80 transition-colors duration-150 hover:border-white/60 hover:text-white'
            >
              More
            </button>
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
                    setQ('');
                    setQLive('');
                    setLocation('');
                    setLocationLive('');
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
                    <SelectValue placeholder='This week' />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='this-week'>This week</SelectItem>
                  <SelectItem value='this-month'>This month</SelectItem>
                  <SelectItem value='all'>All upcoming</SelectItem>
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
                  <SelectItem value='online'>Online</SelectItem>
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
                </SelectContent>
              </Select>
            </div>
          }
        />
        {popular.isLoading ? (
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
              {location.trim()
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
                    setLocation('');
                    setLocationLive('');
                  }}
                >
                  Show everywhere
                </Button>
              )}
            </div>
          </div>
        ) : (
          <EventGrid events={popularEvents} />
        )}
      </section>

      {/* ---- Popular communities ---- */}
      <section>
        <SectionHeader
          eyebrow='Communities'
          title={
            location.trim()
              ? `Popular communities in ${location.trim()}`
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
        {communities.isLoading ? (
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
