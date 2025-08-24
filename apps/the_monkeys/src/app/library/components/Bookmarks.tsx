import { useState } from 'react';

import {
  PaginationNextButton,
  PaginationPrevButton,
} from '@/components/buttons/paginationButton';
import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { BOOKMARKS_PER_PAGE } from '@/constants/posts';
import useGetBookmarkedBlogs from '@/hooks/blog/useGetBookmarkedBlogs';

export const Bookmarks = () => {
  const [page, setPage] = useState<number>(0);
  const offset = page * BOOKMARKS_PER_PAGE;

  const { blogs, isLoading, isError } = useGetBookmarkedBlogs({
    limit: BOOKMARKS_PER_PAGE,
    offset,
  });

  const hasNextPage =
    blogs &&
    blogs?.total_blogs &&
    blogs?.total_blogs > (page + 1) * BOOKMARKS_PER_PAGE;

  const hasPrevPage = page > 0;
  const showPagination =
    blogs?.total_blogs && blogs?.total_blogs > BOOKMARKS_PER_PAGE;

  if (isLoading) {
    return <FeedBlogCardListSkeleton />;
  }

  if (!blogs?.blogs) {
    return null;
  }

  if (isError)
    return (
      <div className='min-h-[800px]'>
        <p className='w-full opacity-90 text-center'>
          No posts bookmarked yet.
        </p>
      </div>
    );

  return (
    <div className='flex flex-col gap-8'>
      {isLoading ? (
        <FeedBlogCardListSkeleton count={BOOKMARKS_PER_PAGE} />
      ) : !blogs?.blogs || blogs?.blogs?.length === 0 ? (
        <p className='w-full opacity-90 text-center'>
          No posts bookmarked yet.
        </p>
      ) : (
        <>
          {blogs?.blogs &&
            blogs?.blogs.map((blog) => {
              return (
                <FeedBlogCard
                  blog={blog}
                  key={blog?.blog_id}
                  showBookmarkOption={true}
                />
              );
            })}

          {showPagination && (
            <div className='py-4 flex justify-center gap-4 mt-6'>
              <PaginationPrevButton
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disable={!hasPrevPage}
              />

              <PaginationNextButton
                onClick={() => setPage((prev) => prev + 1)}
                disable={!hasNextPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
