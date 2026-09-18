'use client';

import Link from 'next/link';

import {
  useSocialCalendar,
  useSocialPosts,
  useSocialQueue,
} from '@/hooks/studio/useSocialPosts';

export default function StudioCollectionPage({
  kind,
}: {
  kind: 'calendar' | 'queue' | 'history';
}) {
  const calendar = useSocialCalendar();
  const queue = useSocialQueue();
  const history = useSocialPosts();
  const source =
    kind === 'calendar' ? calendar : kind === 'queue' ? queue : history;
  const { data, isLoading, isError } = source;
  const posts = data?.items ?? [];
  const title =
    kind === 'calendar' ? 'Calendar' : kind === 'queue' ? 'Queue' : 'History';
  const description =
    kind === 'calendar'
      ? 'See your publishing rhythm at a glance.'
      : kind === 'queue'
        ? 'Your next posts, ready to go.'
        : 'Every draft, publish, and outcome in one place.';

  return (
    <div className='space-y-6'>
      <header>
        <p className='text-sm text-brand-orange'>Studio</p>
        <h2 className='font-newsreader text-4xl'>{title}</h2>
        <p className='mt-1 text-foreground/60'>{description}</p>
      </header>
      <section className='rounded-xl border bg-background-light p-5 dark:bg-background-dark'>
        {isLoading ? (
          <p className='text-sm text-foreground/60'>Loading posts...</p>
        ) : null}
        {isError ? (
          <p className='text-sm text-alert-red'>Unable to load posts.</p>
        ) : null}
        {!isLoading && !isError && posts.length === 0 ? (
          <div className='py-12 text-center text-sm text-foreground/60'>
            Nothing here yet.{' '}
            <Link href='/studio/compose' className='text-brand-orange'>
              Create a post
            </Link>
          </div>
        ) : (
          <div className='divide-y'>
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/studio/compose/${post.id}`}
                className='flex items-center justify-between gap-4 py-4 hover:text-brand-orange'
              >
                <span className='truncate'>
                  {post.base_text || 'Untitled post'}
                </span>
                <span className='shrink-0 text-xs capitalize text-foreground/50'>
                  {post.scheduled_at
                    ? new Date(post.scheduled_at).toLocaleString()
                    : post.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
