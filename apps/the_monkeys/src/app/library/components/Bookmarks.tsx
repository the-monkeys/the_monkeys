'use client';

import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetBookmarkedBlogs from '@/hooks/blog/useGetBookmarkedBlogs';

export const Bookmarks = () => {
  const { blogs, isLoading, isError } = useGetBookmarkedBlogs();

  if (isLoading) {
    return <FeedBlogCardListSkeleton />;
  }

  if (!blogs?.blogs) {
    return null;
  }

  if (isError)
    return (
      <div className='min-h-screen'>
        <p className='w-full opacity-90 text-center'>
          No posts bookmarked yet.
        </p>
      </div>
    );

  return (
    <div className='flex flex-col gap-6'>
      {blogs.blogs.map((blog) => {
        return (
          <FeedBlogCard
            blog={blog}
            key={blog?.blog_id}
            showBookmarkOption={true}
          />
        );
      })}
    </div>
  );
};
