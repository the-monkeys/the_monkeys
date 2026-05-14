'use client';

import Link from 'next/link';

import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import Icon from '@/components/icon';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { TOPIC_ROUTE } from '@/constants/routeConstants';
import useGetFollowingFeed from '@/hooks/blog/useGetFollowingFeed';
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

const BlogFeedPage = () => {
  const { blogs, isError, isLoading } = useGetFollowingFeed({ limit: 30 });

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
    </div>
  );
};

export default BlogFeedPage;
