'use client';

import { FeedBlogCard } from '@/components/blog/cards/FeedBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetBookmarkedBlogs from '@/hooks/blog/useGetBookmarkedBlogs';

export const Bookmarks = () => {
  const { blogs, isLoading, isError } = useGetBookmarkedBlogs();

  if (isError)
    return (
      <div className='min-h-screen'>
        <p className='w-full text-sm opacity-80 text-center'>
          No blogs bookmarked yet.
        </p>
      </div>
    );

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col gap-10'>
        {isLoading ? (
          <FeedBlogCardListSkeleton />
        ) : !blogs?.blogs || blogs?.blogs?.length === 0 ? (
          <p className='w-full text-sm opacity-80 text-center'>
            No saved blogs yet.
          </p>
        ) : (
          blogs?.blogs &&
          blogs?.blogs.map((blog) => {
            return (
              <FeedBlogCard
                key={blog.blog_id}
                blog={blog}
                removeBookmarkOption={true}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
