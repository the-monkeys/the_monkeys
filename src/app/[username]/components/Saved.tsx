'use client';

import { BlogCard } from '@/components/blog/cards/BlogCard';
import { BlogCardSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetBookmarkedBlogs from '@/hooks/blog/useGetBookmarkedBlogs';
import { useSession } from 'next-auth/react';

export const Saved = () => {
  const { status } = useSession();
  const { blogs, isLoading, isError } = useGetBookmarkedBlogs();

  if (isError)
    return (
      <div className='min-h-screen'>
        <p className='w-full font-roboto text-sm opacity-80 text-center'>
          No saved blogs yet.
        </p>
      </div>
    );

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col gap-8 lg:gap-10'>
        {isLoading ? (
          <div className='w-full space-y-6'>
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <BlogCardSkeleton key={index} />
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
