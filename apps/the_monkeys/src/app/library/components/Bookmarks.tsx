import { Suspense } from 'react';

import {
  PaginationNextButton,
  PaginationPrevButton,
} from '@/components/buttons/paginationButton';
import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { BOOKMARKS_PER_PAGE } from '@/constants/posts';
import useGetBookmarkedBlogs from '@/hooks/blog/useGetBookmarkedBlogs';
import { usePagination } from '@/hooks/user/usePagination';

const BookmarksInner = () => {
  const { page, next, prev } = usePagination();

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
    return (
      <div className='min-h-[800px]'>
        <p className='w-full opacity-90 text-center'>
          No posts bookmarked yet.
        </p>
      </div>
    );
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
    <div className='flex flex-col gap-4'>
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
            <div className='flex justify-center gap-[10px] mt-4'>
              {hasPrevPage && (
                <PaginationPrevButton onClick={prev} disable={!hasPrevPage} />
              )}

              {hasNextPage && (
                <PaginationNextButton onClick={next} disable={!hasNextPage} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const Bookmarks = () => {
  return (
    <Suspense fallback={<FeedBlogCardListSkeleton />}>
      <BookmarksInner />
    </Suspense>
  );
};
