'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import useAuth from '@/hooks/auth/useAuth';
import useGetPublishedBlogByUsername from '@/hooks/blog/useGetPublishedBlogByUsername';
import {
  RiCameraLensLine,
  RiExternalLinkLine,
  RiImageLine,
  RiSparklingFill,
} from '@remixicon/react';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

export default function SnapshotPickerPage() {
  const router = useRouter();
  const { data: authUser, isLoading: authLoading } = useAuth();
  const username = authUser?.username;

  const { blogs, isLoading, isError } = useGetPublishedBlogByUsername({
    username,
    limit: 30,
    offset: 0,
  });

  if (authLoading || isLoading) {
    return (
      <div className='mx-auto w-full max-w-5xl px-4 py-8'>
        <div className='mb-6 space-y-2'>
          <Skeleton className='h-8 w-40' />
          <Skeleton className='h-4 w-72' />
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-48 w-full rounded-2xl' />
          ))}
        </div>
      </div>
    );
  }

  if (!username) {
    return (
      <div className='mx-auto w-full max-w-md px-4 py-16 text-center space-y-4'>
        <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange'>
          <RiCameraLensLine size={24} />
        </div>
        <h1 className='font-newsreader text-3xl font-medium text-foreground dark:text-text-dark'>
          Snapshot
        </h1>
        <p className='text-sm text-foreground/70 dark:text-text-dark/70'>
          Sign in to generate social images from your posts, or start from a
          blank canvas.
        </p>
        <div className='flex flex-col items-center gap-3 pt-2'>
          <Button onClick={() => router.push('/auth/login')}>Sign in</Button>
          <Link
            href='/studio/snapshot/new'
            className='text-xs font-semibold text-brand-orange hover:underline'
          >
            Start from scratch
          </Link>
        </div>
      </div>
    );
  }

  const list = blogs?.blogs ?? [];

  return (
    <div className='mx-auto w-full max-w-5xl px-4 py-8 space-y-6'>
      <header>
        <div className='flex items-center gap-2'>
          <span className='rounded bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand-orange'>
            Studio
          </span>
          <span className='text-xs text-foreground/40'>•</span>
          <span className='text-xs text-foreground/50'>Creative Tools</span>
        </div>
        <h1 className='mt-2 font-newsreader text-3xl sm:text-4xl text-foreground dark:text-text-dark'>
          Snapshot
          <span className='text-brand-orange'>.</span>
        </h1>
        <p className='mt-1 text-sm text-foreground/60 dark:text-text-dark/60'>
          Pick a published post to turn into a social-ready image, or start from
          a blank canvas.
        </p>
      </header>

      {isError ? (
        <p role='alert' className='text-sm text-alert-red'>
          Could not load your posts. Please try again.
        </p>
      ) : null}

      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
        {/* Blank Canvas Hero Card */}
        <Link
          href='/studio/snapshot/new'
          className='group flex h-full min-h-[14rem] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand-orange/40 bg-brand-orange/5 p-6 text-center transition-all hover:border-brand-orange hover:bg-brand-orange/10 hover:shadow-sm'
        >
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange transition-transform group-hover:scale-110'>
            <RiSparklingFill size={20} />
          </div>
          <span className='font-newsreader text-2xl font-medium text-brand-orange'>
            Start from scratch
          </span>
          <span className='text-xs text-foreground/60 dark:text-text-dark/60'>
            Type your own headline, description and quote. No post required.
          </span>
        </Link>

        {list.length === 0 ? (
          <div className='col-span-full rounded-2xl border border-dashed border-border-light p-12 text-center text-sm text-foreground/60 dark:border-border-dark dark:text-text-dark/60 sm:col-span-1 lg:col-span-2'>
            You have no published posts yet.
          </div>
        ) : (
          list.map((meta) => (
            <Link
              key={meta.blog_id}
              href={`/studio/snapshot/${encodeURIComponent(meta.blog_id)}`}
              className='group flex flex-col justify-between overflow-hidden rounded-2xl border border-border-light bg-background-light p-3.5 transition-all hover:border-brand-orange/50 hover:shadow-md dark:border-border-dark dark:bg-background-dark'
            >
              <div className='space-y-2.5'>
                {meta.first_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={meta.first_image}
                    alt=''
                    className='h-36 w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]'
                    loading='lazy'
                  />
                ) : (
                  <div className='flex h-36 w-full items-center justify-center rounded-xl bg-foreground-light/30 text-xs text-foreground/40 dark:bg-foreground-dark/20 dark:text-text-dark/40'>
                    No cover image
                  </div>
                )}
                <h2 className='line-clamp-2 font-newsreader text-lg font-medium text-foreground dark:text-text-dark capitalize group-hover:text-brand-orange transition-colors'>
                  {meta.title || 'Untitled'}
                </h2>
                <p className='line-clamp-2 text-xs text-foreground/60 dark:text-text-dark/60'>
                  {meta.first_paragraph}
                </p>
              </div>

              <div className='mt-3 flex items-center justify-between border-t border-border-light/60 pt-2 text-[11px] font-medium text-foreground/50 dark:border-border-dark/60'>
                <span>Create graphic</span>
                <RiExternalLinkLine
                  size={14}
                  className='text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity'
                />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
