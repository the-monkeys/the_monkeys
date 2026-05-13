'use client';

import { useMemo } from 'react';

import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import Icon from '@/components/icon';
import { FeedSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetFollowingFeed from '@/hooks/blog/useGetFollowingFeed';

const BlogFeedPage = () => {
  const { blogs, isError, isLoading } = useGetFollowingFeed({ limit: 30 });

  // const filteredBlogs = useMemo(() => {
  //   return blogs?.blogs?.filter(
  //     (blog) => blog?.first_image && blog?.tags?.length
  //   );
  // }, [blogs]);

  // if (isLoading) {
  //   return <FeedSkeleton />;
  // }

  if (isError) {
    return (
      <div className='px-4 py-12 flex flex-col items-center justify-center'>
        <div className='p-4 flex items-center'>
          <p className='font-dm_sans font-bold text-6xl'>4</p>
          <Icon name='RiErrorWarning' size={50} className='text-alert-red' />
          <p className='font-dm_sans font-bold text-6xl'>4</p>
        </div>

        <h2 className='py-1 font-dm_sans font-medium text-lg text-center'>
          Page not found — but at least you found us!
        </h2>

        <p className='text-base opacity-90 text-center'>
          Try refreshing, or swing by again later.
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <h1 className='text-2xl font-bold hidden'>
        Monkeys - Quality Blogging Community for Technology, Business, Science,
        Lifestyle, Philosophy, and More
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6'>
        {blogs &&
          blogs?.blogs.map((blog) => {
            return (
              <FeedBlogCard variant={'list'} blog={blog} key={blog?.blog_id} />
            );
          })}
      </div>
    </div>
  );
};

export default BlogFeedPage;
