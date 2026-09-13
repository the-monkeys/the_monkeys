'use client';

import { useState } from 'react';

import Link from 'next/link';

import { AuthPromptDialog } from '@/components/auth/AuthPromptDialog';
import useAuth from '@/hooks/auth/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';

const linkClass =
  'inline-flex min-h-11 shrink-0 items-center rounded-full border border-border-light/80 bg-background-light px-3 py-1 font-inter text-xs font-medium text-text-light transition hover:border-brand-orange/50 hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange dark:border-border-dark/60 dark:bg-background-dark dark:text-text-dark sm:min-h-8 sm:px-3 sm:text-[11px]';

const activeLinkClass =
  'inline-flex min-h-11 shrink-0 items-center rounded-full border border-text-light bg-text-light px-3 py-1 font-inter text-xs font-semibold text-background-light transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 dark:border-text-dark dark:bg-text-dark dark:text-background-dark dark:focus-visible:ring-offset-background-dark sm:min-h-8 sm:px-3 sm:text-[11px]';

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
  const { isLoading: isAuthLoading, isSuccess: isAuthenticated } = useAuth();
  const [bookmarkAuthOpen, setBookmarkAuthOpen] = useState(false);
  const [liveStreamAuthOpen, setLiveStreamAuthOpen] = useState(false);

  return (
    <>
      <nav
        aria-label='Explore Monkeys'
        className='overflow-x-auto overscroll-x-contain py-2 [&::-webkit-scrollbar]:hidden'
        style={{ scrollbarWidth: 'none' }}
      >
        <div className='flex min-w-max items-center gap-1.5 sm:gap-1'>
          <Link
            href='#latest-posts'
            aria-current={activeFeedFilter === 'all' ? 'page' : undefined}
            onClick={() => onFeedFilterChange?.('all')}
            className={activeFeedFilter === 'all' ? activeLinkClass : linkClass}
          >
            All stories &amp; events
          </Link>
          <Link
            href='#latest-posts'
            aria-current={activeFeedFilter === 'articles' ? 'page' : undefined}
            onClick={() => onFeedFilterChange?.('articles')}
            className={
              activeFeedFilter === 'articles' ? activeLinkClass : linkClass
            }
          >
            Articles &amp; analysis
          </Link>
          <Link href='/events' className={`${linkClass} gap-1.5`}>
            Upcoming events
            {typeof upcomingCount === 'number' && upcomingCount > 0 ? (
              <span className='rounded-full bg-brand-orange/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-orange'>
                {upcomingCount}
              </span>
            ) : null}
          </Link>
          {isAuthenticated ? (
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
          ) : (
            <button
              type='button'
              className={linkClass}
              disabled={isAuthLoading}
              onClick={() => setLiveStreamAuthOpen(true)}
            >
              Live streams
            </button>
          )}
          {isAuthenticated ? (
            <Link href='/library?source=bookmarks' className={linkClass}>
              Bookmarked
            </Link>
          ) : (
            <button
              type='button'
              className={linkClass}
              disabled={isAuthLoading}
              onClick={() => setBookmarkAuthOpen(true)}
            >
              Bookmarked
            </button>
          )}
        </div>
      </nav>

      <AuthPromptDialog
        open={bookmarkAuthOpen}
        onOpenChange={setBookmarkAuthOpen}
        iconName='RiBookmark'
        title='Log in to view your bookmarks'
        description='Log in or create an account to save posts and return to them whenever you like.'
        callbackPath='/library?source=bookmarks'
      />

      <AuthPromptDialog
        open={liveStreamAuthOpen}
        onOpenChange={setLiveStreamAuthOpen}
        iconName='RiRadioButton'
        title='Log in to join live streams'
        description='Log in or create an account to join live conversations with the Monkeys community.'
      />
    </>
  );
}
