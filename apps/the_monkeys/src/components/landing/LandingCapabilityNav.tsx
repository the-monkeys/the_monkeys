'use client';

import Link from 'next/link';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';

const linkClass =
  'inline-flex min-h-11 shrink-0 items-center rounded-full border border-border-light/80 bg-background-light px-3.5 py-1.5 font-inter text-xs font-medium text-text-light transition hover:border-brand-orange/50 hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange dark:border-border-dark/60 dark:bg-background-dark dark:text-text-dark sm:min-h-9';

const activeLinkClass =
  'inline-flex min-h-11 shrink-0 items-center rounded-full border border-text-light bg-text-light px-3.5 py-1.5 font-inter text-xs font-semibold text-background-light transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 dark:border-text-dark dark:bg-text-dark dark:text-background-dark dark:focus-visible:ring-offset-background-dark sm:min-h-9';

export type LandingFeedFilter = 'all' | 'articles';

export function LandingCapabilityNav({
  upcomingCount,
  activeFeedFilter = 'all',
  onFeedFilterChange,
}: {
  upcomingCount?: number;
  activeFeedFilter?: LandingFeedFilter;
  onFeedFilterChange?: (filter: LandingFeedFilter) => void;
}) {
  return (
    <nav aria-label='Explore Monkeys' className='overflow-x-auto py-2'>
      <div className='flex min-w-max items-center gap-2'>
        <Link
          href='#latest-posts'
          aria-current={activeFeedFilter === 'all' ? 'page' : undefined}
          onClick={() => onFeedFilterChange?.('all')}
          className={activeFeedFilter === 'all' ? activeLinkClass : linkClass}
        >
          All stories and events
        </Link>
        <Link
          href='#latest-posts'
          aria-current={activeFeedFilter === 'articles' ? 'page' : undefined}
          onClick={() => onFeedFilterChange?.('articles')}
          className={
            activeFeedFilter === 'articles' ? activeLinkClass : linkClass
          }
        >
          Articles and analysis
        </Link>
        <Link href='/events' className={`${linkClass} gap-2`}>
          Upcoming events
          {typeof upcomingCount === 'number' && upcomingCount > 0 ? (
            <span className='rounded-full bg-brand-orange/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-orange'>
              {upcomingCount}
            </span>
          ) : null}
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <button type='button' className={linkClass}>
              Live streams
            </button>
          </DialogTrigger>
          <DialogContent className='w-[calc(100vw-2rem)] max-w-md rounded-2xl border border-border-light bg-background-light p-6 dark:border-border-dark dark:bg-background-dark'>
            <DialogHeader>
              <DialogTitle className='font-newsreader text-2xl text-text-light dark:text-text-dark'>
                No live streams right now
              </DialogTitle>
              <DialogDescription className='font-inter text-sm leading-6 text-gray-500 dark:text-gray-400'>
                Check back soon for the next community live stream.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Link href='/library?source=bookmarks' className={linkClass}>
          Bookmarked
        </Link>
      </div>
    </nav>
  );
}
