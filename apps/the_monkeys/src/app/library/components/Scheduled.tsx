import { useState } from 'react';

import {
  PaginationNextButton,
  PaginationPrevButton,
} from '@/components/buttons/paginationButton';
import ScheduledBlogCard from '@/components/cards/blog/ScheduledBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { SCHEDULED_BLOGS_PER_PAGE } from '@/constants/posts';
import useGetScheduledBlogs from '@/hooks/blog/schedule/useGetScheduledBlogs';

export const Scheduled = () => {
  const [page, setPage] = useState<number>(0);
  const offset = page * SCHEDULED_BLOGS_PER_PAGE;

  const { blogs, isLoading, isError } = useGetScheduledBlogs({
    limit: SCHEDULED_BLOGS_PER_PAGE,
    offset,
  });

  const hasNextPage =
    blogs &&
    blogs?.total_blogs &&
    blogs?.total_blogs > (page + 1) * SCHEDULED_BLOGS_PER_PAGE;

  const hasPrevPage = page > 0;
  const showPagination =
    blogs?.total_blogs && blogs?.total_blogs > SCHEDULED_BLOGS_PER_PAGE;

  if (isError)
    return (
      <div className='min-h-[200px] flex items-center justify-center'>
        <p className='text-muted-foreground'>Failed to load scheduled blogs.</p>
      </div>
    );

  return (
    <div className='flex flex-col gap-4'>
      {isLoading ? (
        <FeedBlogCardListSkeleton count={SCHEDULED_BLOGS_PER_PAGE} />
      ) : !blogs?.blogs || blogs.blogs.length === 0 ? (
        <div className='min-h-[200px] flex items-center justify-center flex-col gap-2'>
          <p className='text-muted-foreground'>No scheduled blogs found.</p>
          <p className='text-sm text-muted-foreground opacity-80'>
            Schedule a blog from the editor to see it here.
          </p>
        </div>
      ) : (
        <>
          {blogs.blogs.map((blog) => (
            <ScheduledBlogCard key={blog.blog_id} blog={blog} />
          ))}

          {showPagination && (
            <div className='flex justify-center gap-[10px] mt-4'>
              {hasPrevPage && (
                <PaginationPrevButton
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disable={!hasPrevPage}
                />
              )}

              {hasNextPage && (
                <PaginationNextButton
                  onClick={() => setPage((prev) => prev + 1)}
                  disable={!hasNextPage}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
