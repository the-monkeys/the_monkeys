'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import useAuth from '@/hooks/auth/useAuth';
import useGetPublishedBlogByUsername from '@/hooks/blog/useGetPublishedBlogByUsername';
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
        <h1 className='mb-2 font-newsreader text-3xl'>Snapshot</h1>
        <p className='mb-6 text-foreground/60'>
          Generate share-ready social images from your published posts.
        </p>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-40 w-full rounded-xl' />
          ))}
        </div>
      </div>
    );
  }

  if (!username) {
    return (
      <div className='mx-auto w-full max-w-md px-4 py-16 text-center'>
        <h1 className='mb-2 font-newsreader text-3xl'>Snapshot</h1>
        <p className='mb-6 text-foreground/70'>
          Sign in to generate social images from your posts, or start from a
          blank canvas.
        </p>
        <div className='flex flex-col items-center gap-3'>
          <Button onClick={() => router.push('/auth/login')}>Sign in</Button>
          <Link
            href='/snapshot/new'
            className='text-sm text-brand-orange underline'
          >
            Start from scratch
          </Link>
        </div>
      </div>
    );
  }

  const list = blogs?.blogs ?? [];

  return (
    <div className='mx-auto w-full max-w-5xl px-4 py-8'>
      <header className='mb-6'>
        <h1 className='font-newsreader text-3xl'>
          Snapshot
          <span className='text-brand-orange'>.</span>
        </h1>
        <p className='text-foreground/60'>
          Pick a published post to turn into a social-ready image, or start from
          a blank canvas.
        </p>
      </header>

      {isError ? (
        <p role='alert' className='text-sm text-alert-red'>
          Could not load your posts. Please try again.
        </p>
      ) : null}

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <Link
          href='/snapshot/new'
          className='group flex h-full min-h-[14rem] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-orange/40 bg-brand-orange/5 p-4 text-center transition-colors hover:border-brand-orange hover:bg-brand-orange/10'
        >
          <span className='font-newsreader text-2xl text-brand-orange'>
            Start from scratch
          </span>
          <span className='text-xs text-foreground/60'>
            Type your own headline, description and quote — no post required.
          </span>
        </Link>

        {list.length === 0 ? (
          <div className='col-span-full rounded-xl border border-dashed p-8 text-center text-foreground/60 sm:col-span-1 lg:col-span-2'>
            You have no published posts yet.
          </div>
        ) : (
          list.map((meta) => (
            <Link
              key={meta.blog_id}
              href={`/snapshot/${encodeURIComponent(meta.blog_id)}`}
              className='group flex flex-col gap-2 overflow-hidden rounded-xl border bg-foreground-light/30 p-3 transition-colors hover:border-brand-orange/60 dark:bg-foreground-dark/20'
            >
              {meta.first_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={meta.first_image}
                  alt=''
                  className='h-32 w-full rounded-lg object-cover'
                  loading='lazy'
                />
              ) : (
                <div className='flex h-32 w-full items-center justify-center rounded-lg bg-foreground-light/50 text-foreground/40 dark:bg-foreground-dark/40'>
                  No cover
                </div>
              )}
              <h2 className='line-clamp-2 font-newsreader text-base capitalize'>
                {meta.title || 'Untitled'}
              </h2>
              <p className='line-clamp-2 text-xs text-foreground/60'>
                {meta.first_paragraph}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
