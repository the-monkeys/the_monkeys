'use client';

import { Suspense, useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  PaginationNextButton,
  PaginationPrevButton,
} from '@/components/buttons/paginationButton';
import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { FeedUnavailable } from '@/components/feed/FeedUnavailable';
import { FollowingDiscussions } from '@/components/feed/FollowingDiscussions';
import Icon from '@/components/icon';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { FOLLOWING_FEED_PER_PAGE } from '@/constants/posts';
import { TOPIC_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import useGetFollowingFeed from '@/hooks/blog/useGetFollowingFeed';
import { usePagination } from '@/hooks/user/usePagination';
import { loginHref } from '@/lib/authRedirect';
import type { FollowingViewer } from '@/lib/followingSession';
import { cn } from '@/lib/utils';
import { fromFollowingFeed } from '@/utils/blogCardAdapters';
import { isAuthError } from '@/utils/errorUtils';

const EmptyFeed = () => (
  <section className='flex w-full justify-center px-4'>
    <div className='w-full max-w-2xl py-16 flex flex-col items-center text-center gap-6'>
      <div className='p-4 rounded-full bg-foreground-light dark:bg-foreground-dark'>
        <Icon name='RiUserFollow' size={32} className='opacity-50' />
      </div>

      <div className='space-y-2'>
        <h2 className='font-dm_sans text-2xl font-bold'>Your feed is empty</h2>
        <p className='text-sm opacity-70 max-w-sm'>
          Follow creators or topics that match your interests and start
          discovering the best content.
        </p>
      </div>

      <div className='flex flex-col sm:flex-row items-center gap-3'>
        <Link
          href={TOPIC_ROUTE + '/explore'}
          className='px-5 py-2 rounded-full bg-brand-orange text-white text-sm font-medium hover:opacity-90 transition-opacity'
        >
          Explore topics
        </Link>
        <Link
          href='/'
          className='px-5 py-2 rounded-full border border-border-light dark:border-border-dark text-sm font-medium hover:opacity-80 transition-opacity'
        >
          Browse feed
        </Link>
      </div>
    </div>
  </section>
);

const FollowingPosts = ({ viewer }: { viewer: FollowingViewer }) => {
  const { page, next, prev } = usePagination();
  const offset = page * FOLLOWING_FEED_PER_PAGE;

  const { blogs, totalBlogs, isError, isLoading } = useGetFollowingFeed({
    limit: FOLLOWING_FEED_PER_PAGE,
    offset,
    viewerUsername: viewer.username,
    viewerAccountId: viewer.accountId,
  });

  const hasNextPage =
    totalBlogs != null && totalBlogs > (page + 1) * FOLLOWING_FEED_PER_PAGE;
  const hasPrevPage = page > 0;
  const showPagination = (totalBlogs ?? 0) > FOLLOWING_FEED_PER_PAGE;

  if (isLoading) return <FeedBlogCardListSkeleton />;

  if (isError || !blogs?.length) return <EmptyFeed />;

  return (
    <div className='min-h-screen'>
      <div className='grid grid-cols-1 gap-y-4 gap-x-6'>
        {blogs.map((blog) => (
          <FeedBlogCard
            blog={fromFollowingFeed(blog)}
            variant='list'
            showBookmark
            key={blog.blog_id}
          />
        ))}
      </div>

      {showPagination && (
        <div className='flex justify-center gap-[10px] mt-4'>
          {hasPrevPage && (
            <PaginationPrevButton onClick={prev} disable={!hasPrevPage} />
          )}
          {hasNextPage && (
            <PaginationNextButton onClick={next} disable={!hasNextPage} />
          )}
        </div>
      )}
    </div>
  );
};

function FollowingContent({ viewer }: { viewer: FollowingViewer }) {
  const [view, setView] = useState<'posts' | 'discussions'>('posts');
  return (
    <div className='min-w-0 pb-24 lg:pb-0'>
      <header className='mb-5'>
        <p className='font-inter text-[11px] font-bold uppercase tracking-[0.22em] text-brand-orange'>
          Following
        </p>
        <h1 className='mt-1 font-newsreader text-4xl font-bold'>Your feed</h1>
        <p className='mt-2 font-inter text-sm text-gray-500'>
          Posts and public discussions from people you follow.
        </p>
      </header>
      <nav
        aria-label='Following feed views'
        className='mb-4 flex flex-wrap gap-2'
      >
        {(['posts', 'discussions'] as const).map((item) => (
          <button
            aria-pressed={view === item}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 font-inter text-sm font-medium',
              view === item
                ? 'border-transparent bg-text-light text-white dark:bg-text-dark dark:text-black'
                : 'border-border-light dark:border-border-dark/40'
            )}
            key={item}
            onClick={() => setView(item)}
            type='button'
          >
            <Icon
              name={item === 'posts' ? 'RiNewspaper' : 'RiChat1'}
              size={18}
            />
            {item === 'posts' ? 'Posts' : 'Discussions'}
          </button>
        ))}
      </nav>
      {view === 'posts' ? (
        <Suspense fallback={<FeedBlogCardListSkeleton />}>
          <FollowingPosts viewer={viewer} />
        </Suspense>
      ) : (
        <FollowingDiscussions viewerAccountId={viewer.accountId} />
      )}
    </div>
  );
}

export default function FollowingFeedClient({
  viewer,
}: {
  viewer: FollowingViewer;
}) {
  const auth = useAuth();
  const router = useRouter();
  const username = auth.data?.username;
  const anonymous =
    !auth.isPending &&
    ((auth.isError && isAuthError(auth.error)) || (!auth.isError && !username));
  const mismatch =
    Boolean(username) &&
    (auth.data?.account_id !== viewer.accountId ||
      username !== viewer.username);
  const refetchAuth = auth.refetch;
  useEffect(() => {
    if (anonymous) router.replace(loginHref('/feed'));
    else if (!auth.isPending && !auth.isError && mismatch) {
      void refetchAuth().then((result) => {
        if (
          !result.error &&
          (result.data?.account_id !== viewer.accountId ||
            result.data?.username !== viewer.username)
        )
          router.refresh();
      });
    }
  }, [
    anonymous,
    auth.isPending,
    auth.isError,
    mismatch,
    refetchAuth,
    viewer.accountId,
    viewer.username,
    router,
  ]);
  if (auth.isPending || anonymous) return <FeedBlogCardListSkeleton />;
  if (auth.isError || !username)
    return (
      <FeedUnavailable
        onRetry={() => {
          void refetchAuth();
        }}
      />
    );
  if (mismatch) return <FeedBlogCardListSkeleton />;
  return <FollowingContent key={viewer.accountId} viewer={viewer} />;
}
