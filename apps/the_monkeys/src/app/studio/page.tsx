'use client';

import Link from 'next/link';

import { useSocialPosts } from '@/hooks/studio/useSocialPosts';

export default function StudioPage() {
  const { data, isLoading, isError } = useSocialPosts({ page_size: 10 });
  const posts = data?.items ?? [];

  return (
    <div className='space-y-6'>
      <header className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
        <div>
          <p className='text-sm font-medium text-brand-orange'>
            Your social desk
          </p>
          <h2 className='font-newsreader text-4xl'>What are you publishing?</h2>
          <p className='mt-1 max-w-xl text-foreground/60'>
            Shape one idea into platform-ready posts, then schedule it across
            your channels.
          </p>
        </div>
        <Link
          href='/studio/compose'
          className='rounded-lg bg-brand-orange px-4 py-2 text-center text-sm font-semibold text-white hover:opacity-90'
        >
          Create a post
        </Link>
      </header>
      <div className='grid gap-4 sm:grid-cols-3'>
        {[
          [
            'Drafts',
            posts.filter((post) => (post.state ?? post.status) === 'draft')
              .length,
          ],
          [
            'Scheduled',
            posts.filter((post) => (post.state ?? post.status) === 'scheduled')
              .length,
          ],
          [
            'Published',
            posts.filter((post) => (post.state ?? post.status) === 'published')
              .length,
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            className='rounded-xl border bg-background-light p-5 dark:bg-background-dark'
          >
            <p className='text-sm text-foreground/60'>{label}</p>
            <p className='mt-2 text-3xl font-semibold'>{value}</p>
          </div>
        ))}
      </div>
      <section className='rounded-xl border bg-background-light p-5 dark:bg-background-dark'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='font-newsreader text-2xl'>Recent work</h3>
          <Link href='/studio/history' className='text-sm text-brand-orange'>
            View history
          </Link>
        </div>
        {isLoading ? (
          <p className='text-sm text-foreground/60'>Loading your posts...</p>
        ) : null}
        {isError ? (
          <p className='text-sm text-alert-red'>Unable to load social posts.</p>
        ) : null}
        {!isLoading && !isError && posts.length === 0 ? (
          <p className='text-sm text-foreground/60'>
            Your drafts and scheduled posts will appear here.
          </p>
        ) : null}
        <div className='divide-y'>
          {posts.slice(0, 5).map((post) => (
            <Link
              key={post.id}
              href={`/studio/compose/${post.id}`}
              className='block py-3 hover:text-brand-orange'
            >
              <div className='flex items-center justify-between gap-4'>
                <span className='truncate'>
                  {post.base_text || 'Untitled post'}
                </span>
                <span className='shrink-0 text-xs capitalize text-foreground/50'>
                  {post.state || post.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
