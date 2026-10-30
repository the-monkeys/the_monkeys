'use client';

import Link from 'next/link';

import { DiscussionFeed } from '@/components/discussions/DiscussionListClient';
import { FOLLOWING_DISCUSSIONS_QUERY_KEY } from '@/lib/followingFeedKeys';
import { listFollowingDiscussions } from '@/services/discussions/discussionsApi';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';

export function FollowingDiscussions({
  viewerAccountId,
}: {
  viewerAccountId: string;
}) {
  const query = useInfiniteQuery({
    queryKey: [FOLLOWING_DISCUSSIONS_QUERY_KEY, viewerAccountId],
    enabled: Boolean(viewerAccountId),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) =>
      listFollowingDiscussions(pageParam, signal),
    getNextPageParam: (page) => {
      const posts = page.discussions ?? [];
      return posts.length >= 20
        ? posts[posts.length - 1]?.public_id
        : undefined;
    },
    retry: false,
  });

  if (query.isPending)
    return (
      <p className='py-6 font-inter text-sm text-gray-500' role='status'>
        Loading discussions...
      </p>
    );
  if (query.isError)
    return (
      <div className='rounded-2xl border border-border-light p-5 dark:border-border-dark/40'>
        <p className='font-inter text-sm text-gray-500' role='alert'>
          Could not load discussions from people you follow.
        </p>
        <Button
          className='mt-3'
          onClick={() => query.refetch()}
          variant='outline'
        >
          Try again
        </Button>
      </div>
    );
  const posts = query.data.pages.flatMap((page) => page.discussions ?? []);
  return (
    <section aria-label='Discussions from people you follow'>
      {posts.length ? (
        <DiscussionFeed posts={posts} />
      ) : (
        <div className='rounded-2xl border border-border-light p-5 dark:border-border-dark/40'>
          <h2 className='font-newsreader text-2xl font-semibold'>
            No discussions from people you follow yet
          </h2>
          <p className='mt-2 font-inter text-sm text-gray-500'>
            Follow people to see their public discussions here.
          </p>
          <Link
            className='mt-3 inline-flex min-h-11 items-center font-inter text-sm font-semibold text-brand-orange'
            href='/discussions'
          >
            Explore all discussions
          </Link>
        </div>
      )}
      {query.hasNextPage ? (
        <Button
          className='mt-4'
          disabled={query.isFetchingNextPage}
          onClick={() => query.fetchNextPage()}
          variant='outline'
        >
          Older discussions
        </Button>
      ) : null}
    </section>
  );
}
