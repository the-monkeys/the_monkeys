'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';

import { EventGridCard } from '@/components/events/EventGridCard';
import { GroupGridCard } from '@/components/groups/GroupGridCard';
import Icon, { IconName } from '@/components/icon';
import {
  EVENTS_ROUTE,
  GROUPS_ROUTE,
  LOGIN_ROUTE,
} from '@/constants/routeConstants';
import { useEventList } from '@/hooks/events/useEventQueries';
import { useGroupList } from '@/hooks/groups/useGroupQueries';
import { parseEventTime } from '@/lib/eventTime';
import { EventItem, ListFilters } from '@/services/events/eventTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';

// Category pills map to the backend `tags` filter (GET /events binds `tags`).
const CATEGORIES: { label: string; tag: string }[] = [
  { label: 'Networking', tag: 'networking' },
  { label: 'Tech & AI', tag: 'tech' },
  { label: 'Writing & Storytelling', tag: 'writing' },
  { label: 'Outdoor', tag: 'outdoor' },
  { label: 'Sports & Hobbies', tag: 'sports' },
];

// Large intent cards — each pre-filters the events grid via the tags filter.
const INTENTS: {
  title: string;
  copy: string;
  tag: string;
  icon: IconName;
  gradient: string;
}[] = [
  {
    title: 'Meet new friends',
    copy: 'Casual meetups and social hangs',
    tag: 'social',
    icon: 'RiShakeHands',
    gradient: 'from-[#FF7A5A] to-[#E5391F]',
  },
  {
    title: 'Networking & Tech',
    copy: 'Talks, demos, and AI deep-dives',
    tag: 'tech',
    icon: 'RiCodeSSlash',
    gradient: 'from-[#3A3A4D] to-[#1C1C26]',
  },
  {
    title: 'Writing & Workshops',
    copy: 'Craft sessions and story circles',
    tag: 'writing',
    icon: 'RiPencil',
    gradient: 'from-[#E0913E] to-[#C4661C]',
  },
  {
    title: 'Sports & Outdoor',
    copy: 'Runs, hikes, and pick-up games',
    tag: 'outdoor',
    icon: 'RiCompass',
    gradient: 'from-[#2F6B5E] to-[#1E4A40]',
  },
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
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className='mb-5 flex items-end justify-between gap-4'>
      <div>
        {eyebrow && (
          <p className='font-inter text-[11px] font-bold uppercase tracking-[0.2em] text-brand-orange'>
            {eyebrow}
          </p>
        )}
        <h2 className='mt-1 font-newsreader text-2xl font-bold sm:text-3xl'>
          {title}
        </h2>
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
// Client-side date bucketing (backend GET /events exposes no date filters).
// -----------------------------------------------------------------------------

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isToday(value: EventItem['start_time']): boolean {
  const d = parseEventTime(value);
  if (!d) return false;
  return startOfDay(d).getTime() === startOfDay(new Date()).getTime();
}

function weekendRange(now: Date): [number, number] {
  const day = now.getDay(); // 0 Sun … 6 Sat
  if (day === 0) {
    const s = startOfDay(now);
    const e = new Date(s);
    e.setHours(23, 59, 59, 999);
    return [s.getTime(), e.getTime()];
  }
  const toSat = (6 - day + 7) % 7;
  const sat = startOfDay(now);
  sat.setDate(sat.getDate() + toSat);
  const end = new Date(sat);
  end.setDate(sat.getDate() + 1);
  end.setHours(23, 59, 59, 999);
  return [sat.getTime(), end.getTime()];
}

function isThisWeekend(value: EventItem['start_time']): boolean {
  const d = parseEventTime(value);
  if (!d) return false;
  const [from, to] = weekendRange(new Date());
  const t = d.getTime();
  return t >= from && t <= to;
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
  const [feed, setFeed] = useState<'today' | 'weekend'>('today');

  const gridRef = useRef<HTMLDivElement | null>(null);

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
  // Unfiltered upcoming pool for the time-based feeds (stable key, deduped).
  const feedPool = useEventList({ limit: 30, offset: 0 });
  const communities = useGroupList({
    limit: 8,
    city: location.trim() || undefined,
  });

  const popularEvents = popular.data?.events || [];
  const pool = useMemo(() => feedPool.data?.events || [], [feedPool.data]);
  const todayEvents = useMemo(
    () => pool.filter((e) => isToday(e.start_time)),
    [pool]
  );
  const weekendEvents = useMemo(
    () => pool.filter((e) => isThisWeekend(e.start_time)),
    [pool]
  );
  const groups = communities.data?.groups || [];

  const applyTag = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? '' : tag));
    // Reveal the filtered grid.
    requestAnimationFrame(() =>
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    );
  };

  const feedEvents = feed === 'today' ? todayEvents : weekendEvents;

  return (
    <div className='space-y-14 sm:space-y-20'>
      {/* ---- Hero: search + category pills ---- */}
      <section className='relative overflow-hidden rounded-2xl bg-[radial-gradient(130%_130%_at_0%_0%,#FF7A5A_0%,#FF5542_44%,#E5391F_100%)] px-6 py-10 text-white sm:px-10 sm:py-14'>
        {/* Brand-tone light + shadow blooms give the hero crafted depth instead
            of a flat fill; both are decorative and non-interactive. */}
        <div
          aria-hidden
          className='pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl'
        />
        <div
          aria-hidden
          className='pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-black/15 blur-3xl'
        />
        <div className='relative'>
          <p className='font-inter text-[11px] font-bold uppercase tracking-[0.22em] text-white/80'>
            Community
          </p>
          <h1 className='mt-2 max-w-3xl font-newsreader text-3xl font-bold leading-[1.1] sm:text-5xl'>
            Find your people. Join the next meetup.
          </h1>
          <p className='mt-3 max-w-xl font-inter text-sm text-white/90 sm:text-base'>
            Talks, workshops, and live sessions happening near you and online.
          </p>

          <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
            <label className='relative flex-1'>
              <span className='sr-only'>Search events</span>
              <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                <Icon name='RiSearch' size={18} />
              </span>
              <Input
                value={qLive}
                onChange={(e) => setQLive(e.target.value)}
                placeholder='Search events by name or topic'
                // Field sits on the coloured hero, so keep it white with dark
                // text (and caret) in BOTH themes. The atom sets
                // dark:bg-background-dark, which we must override or the caret
                // and typed text vanish on the dark background in dark mode.
                className='h-12 bg-white pl-10 text-text-light caret-text-light placeholder:text-gray-400 dark:bg-white dark:text-text-light'
              />
            </label>
            <label className='relative sm:w-64'>
              <span className='sr-only'>Location</span>
              <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                <Icon name='RiMapPinUser' size={18} />
              </span>
              <Input
                value={locationLive}
                onChange={(e) => setLocationLive(e.target.value)}
                placeholder='City or online'
                className='h-12 bg-white pl-10 text-text-light caret-text-light placeholder:text-gray-400 dark:bg-white dark:text-text-light'
              />
            </label>
            <Button
              asChild
              className='h-12 bg-white font-semibold text-brand-orange hover:bg-white/90 sm:w-auto'
            >
              <Link href={signedIn ? `${EVENTS_ROUTE}/new` : LOGIN_ROUTE}>
                Create event
              </Link>
            </Button>
          </div>

          <div className='-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1'>
            {CATEGORIES.map((c) => (
              <button
                key={c.tag}
                type='button'
                onClick={() => applyTag(c.tag)}
                aria-pressed={activeTag === c.tag}
                className={`whitespace-nowrap rounded-full border px-4 py-2 font-inter text-sm transition-colors ${
                  activeTag === c.tag
                    ? 'border-white bg-white text-brand-orange'
                    : 'border-white/40 text-white hover:bg-white/10'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Popular events grid ---- */}
      <section ref={gridRef} className='scroll-mt-24'>
        <SectionHeader
          eyebrow={location.trim() ? `Near ${location.trim()}` : 'Near you'}
          title={
            activeTag
              ? `Events tagged “${activeTag}”`
              : 'Popular events near you'
          }
          action={
            activeTag || q.trim() || location.trim() ? (
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
            ) : undefined
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

      {/* ---- Intent / category cards ---- */}
      <section>
        <SectionHeader eyebrow='Browse by vibe' title='What are you into?' />
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {INTENTS.map((it) => (
            <button
              key={it.tag}
              type='button'
              onClick={() => applyTag(it.tag)}
              className={`group relative flex h-40 flex-col justify-end overflow-hidden rounded-xl bg-gradient-to-br p-5 text-left text-white ${it.gradient}`}
            >
              <span className='absolute right-4 top-4 opacity-80 transition-transform duration-300 group-hover:scale-110'>
                <Icon name={it.icon} size={32} />
              </span>
              <span className='font-newsreader text-xl font-bold leading-tight'>
                {it.title}
              </span>
              <span className='mt-1 font-inter text-xs text-white/85'>
                {it.copy}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ---- Time-based feeds (client-side bucketed) ---- */}
      <section>
        <SectionHeader
          eyebrow='On the calendar'
          title="What's happening soon"
          action={
            <div className='flex rounded-full border border-border-light p-1 dark:border-border-dark/40'>
              {(
                [
                  ['today', 'Today'],
                  ['weekend', 'This weekend'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type='button'
                  onClick={() => setFeed(id)}
                  aria-pressed={feed === id}
                  className={`rounded-full px-3 py-1.5 font-inter text-xs font-medium transition-colors sm:text-sm ${
                    feed === id
                      ? 'bg-brand-orange text-white'
                      : 'text-gray-500 hover:text-brand-orange'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          }
        />
        {feedPool.isLoading ? (
          <GridSkeleton count={4} />
        ) : feedEvents.length === 0 ? (
          <p className='rounded-xl border border-dashed border-border-light py-12 text-center font-inter text-sm text-gray-500 dark:border-border-dark/40'>
            {feed === 'today'
              ? 'Nothing scheduled for today yet.'
              : 'No events this weekend yet — check back soon.'}
          </p>
        ) : (
          <EventGrid events={feedEvents} />
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

      {/* ---- CTA banner ---- */}
      <section className='grid grid-cols-1 gap-4 rounded-2xl border border-border-light bg-gray-50 p-6 dark:border-border-dark/40 dark:bg-black/20 sm:grid-cols-2 sm:p-10'>
        <div>
          <h2 className='font-newsreader text-2xl font-bold sm:text-3xl'>
            Organize your own Monkeys chapter
          </h2>
          <p className='mt-2 max-w-md font-inter text-sm text-gray-500 dark:text-gray-400'>
            Rally people around what you love. Create a community group, host
            events, and grow your local scene.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-3 sm:justify-end'>
          <Button asChild variant='brand' className='h-11'>
            <Link href={signedIn ? `${GROUPS_ROUTE}/new` : LOGIN_ROUTE}>
              Create a community group
            </Link>
          </Button>
          <Button asChild variant='outline' className='h-11'>
            <Link href={signedIn ? `${EVENTS_ROUTE}/new` : LOGIN_ROUTE}>
              Host an event
            </Link>
          </Button>
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
