'use client';

import { Suspense } from 'react';

import Link from 'next/link';

import {
  PaginationNextButton,
  PaginationPrevButton,
} from '@/components/buttons/paginationButton';
import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import Icon from '@/components/icon';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { FOLLOWING_FEED_PER_PAGE } from '@/constants/posts';
import { TOPIC_ROUTE } from '@/constants/routeConstants';
import useGetFollowingFeed from '@/hooks/blog/useGetFollowingFeed';
import { usePagination } from '@/hooks/user/usePagination';
import { fromFollowingFeed } from '@/utils/blogCardAdapters';

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

const BlogFeedPageInner = () => {
  const { page, next, prev } = usePagination();
  const offset = page * FOLLOWING_FEED_PER_PAGE;

  const { blogs, totalBlogs, isError, isLoading } = useGetFollowingFeed({
    limit: FOLLOWING_FEED_PER_PAGE,
    offset,
  });

  const hasNextPage =
    totalBlogs != null && totalBlogs > (page + 1) * FOLLOWING_FEED_PER_PAGE;
  const hasPrevPage = page > 0;
  const showPagination = (totalBlogs ?? 0) > FOLLOWING_FEED_PER_PAGE;

  if (isLoading) return <FeedBlogCardListSkeleton />;

  if (isError || !blogs?.length) return <EmptyFeed />;

  return (
    <div className='min-h-screen'>
      <h1 className='text-2xl font-bold hidden'>
        Monkeys - Quality Blogging Community for Technology, Business, Science,
        Lifestyle, Philosophy, and More
      </h1>

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

const BlogFeedPage = () => {
  return (
    <Suspense fallback={<FeedBlogCardListSkeleton />}>
      <BlogFeedPageInner />
    </Suspense>
  );
};

export default BlogFeedPage;
