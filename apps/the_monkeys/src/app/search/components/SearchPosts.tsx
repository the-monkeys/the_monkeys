import React, { useState } from 'react';

import { 
  PaginationNextButton, 
  PaginationPrevButton 
} from '@/components/buttons/paginationButton';
import { PROFILE_POSTS_PER_PAGE } from '@/constants/posts';
import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { useGetSearchBlog } from '@/hooks/blog/useGetSearchBlog';

export const SearchPosts = ({ query }: { query: string }) => {
  const [page, setPage] = useState<number>(0);
  const offset = page * PROFILE_POSTS_PER_PAGE;

  const { searchBlogs, searchBlogsLoading, searchBlogsError } = useGetSearchBlog({
    searchQuery: query.trim() ? query : undefined,
    limit: 10,
    offset,
  });

  if (searchBlogsLoading) {
    return <FeedBlogCardListSkeleton />;
  }

  if (searchBlogsError) {
    return (
      <div className='p-2 flex items-center justify-center'>
        <p className='opacity-90'>No results found.</p>
      </div>
    );
  }

  const blogs = searchBlogs?.blogs;
  console.log(blogs);

  const hasNextPage =
    blogs &&
    blogs?.length &&
    blogs?.length > (page + 1) * PROFILE_POSTS_PER_PAGE;

  const hasPrevPage = page > 0;
  const showPagination =
    blogs?.length && blogs?.length > PROFILE_POSTS_PER_PAGE;

  return (
    <>
      {!blogs || blogs === null ? (
        <p className='py-2 text-sm opacity-90 text-center'>
          No posts found for your search
        </p>
      ) : (
        <div className='max-w-4xl'>
          <div className='flex flex-col gap-4'>
            {blogs.slice(0, 8).map((blog) => {
              return <FeedBlogCard blog={blog} key={blog?.blog_id} />;
            })}
          </div>

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
        </div>
      )}
    </>
  );
};
