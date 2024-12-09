'use client';

import { BlogCard } from '@/components/blog/cards/BlogCard';
import { BlogListCardSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetBookmarkedBlogs from '@/hooks/blog/useGetBookmarkedBlogs';
import { useSession } from 'next-auth/react';

export const Saved = () => {
  const { status } = useSession();
  const { blogs, isLoading, isError } = useGetBookmarkedBlogs();

  if (isError)
    return (
      <p className='w-full font-roboto text-sm opacity-80 text-center'>
        Oops! Something went wrong. Please try again.
      </p>
    );

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col gap-6 sm:gap-8'>
        {isLoading ? (
          <div className='w-full space-y-6'>
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <BlogListCardSkeleton key={index} />
              ))}
          </div>
        ) : !blogs?.blogs || blogs?.blogs?.length === 0 ? (
          <p className='w-full font-roboto text-sm opacity-80 text-center'>
            No saved blogs yet.
          </p>
        ) : (
          blogs?.blogs &&
          blogs?.blogs.map((blog) => {
            return (
              <BlogCard
                key={blog?.blog_id}
                blog={blog}
                status={status}
                onEdit={() => {}}
                modificationEnable={false}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
