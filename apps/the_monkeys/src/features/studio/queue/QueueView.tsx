'use client';

import Link from 'next/link';

import { useSocialQueue } from '@/hooks/studio/useSocialPosts';

import QueueHeader from './QueueHeader';
import SortableQueueList from './SortableQueueList';

export interface QueueViewProps {
  className?: string;
}

export default function QueueView({ className = '' }: QueueViewProps) {
  const { data, isLoading, isError, refetch } = useSocialQueue(100);
  const posts = data?.items ?? data?.posts ?? [];

  return (
    <div className={`space-y-6 ${className}`}>
      <QueueHeader totalCount={posts.length} />

      {isLoading && (
        <div
          data-testid='queue-skeleton'
          role='status'
          aria-label='Loading queue'
          className='space-y-3'
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='flex animate-pulse items-center gap-4 rounded-xl border border-border/40 bg-background-light p-4 dark:bg-background-dark'
            >
              <div className='h-5 w-4 rounded bg-foreground/10' />
              <div className='h-6 w-8 rounded bg-foreground/10' />
              <div className='flex flex-col gap-1'>
                <div className='h-4 w-4 rounded bg-foreground/10' />
                <div className='h-4 w-4 rounded bg-foreground/10' />
              </div>
              <div className='flex-1 space-y-2'>
                <div className='h-4 w-3/4 rounded bg-foreground/10' />
                <div className='h-3 w-1/3 rounded bg-foreground/10' />
              </div>
              <div className='h-8 w-8 rounded bg-foreground/10' />
            </div>
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div className='rounded-xl border border-alert-red/30 bg-alert-red/5 p-6 text-center'>
          <p className='text-sm font-medium text-alert-red'>
            Unable to load scheduled queue.
          </p>
          <button
            type='button'
            onClick={() => refetch()}
            className='mt-2 text-xs font-semibold text-brand-orange hover:underline'
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-background-light/50 px-6 py-16 text-center dark:bg-background-dark/50'>
          <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z'
              />
            </svg>
          </div>
          <h3 className='font-newsreader text-xl font-medium text-foreground'>
            Your queue is empty
          </h3>
          <p className='mt-1 max-w-sm text-sm text-foreground/60'>
            There are no scheduled posts in your publishing queue. Schedule
            posts to keep your social channels active.
          </p>
          <Link
            href='/studio/compose'
            className='mt-6 inline-flex items-center gap-1.5 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90'
          >
            Create Post
          </Link>
        </div>
      )}

      {!isLoading && !isError && posts.length > 0 && (
        <SortableQueueList items={posts} onActionComplete={() => refetch()} />
      )}
    </div>
  );
}
