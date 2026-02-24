import React, { useState } from 'react';

import {
  PaginationNextButton,
  PaginationPrevButton,
} from '@/components/buttons/paginationButton';
import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { SEARCH_POSTS_PER_PAGE } from '@/constants/posts';
import { useGetSearchBlog } from '@/hooks/blog/useGetSearchBlog';
import { usePagination } from '@/hooks/user/usePagination';

export const SearchPosts = ({ query }: { query: string }) => {
  const { page, next, prev } = usePagination();

  // const [currentQuery, setCurrentQuery] = useState<string>(query);
  // if (currentQuery !== query) {
  //   setCurrentQuery(query);
  //   page = 0;

  // }

  const offset = page * SEARCH_POSTS_PER_PAGE;

  const { searchBlogs, searchBlogsLoading, searchBlogsError } =
    useGetSearchBlog({
      searchQuery: query.trim(),
      limit: SEARCH_POSTS_PER_PAGE,
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

  const hasNextPage =
    blogs &&
    searchBlogs?.total_blogs &&
    searchBlogs?.total_blogs > (page + 1) * SEARCH_POSTS_PER_PAGE;

  const hasPrevPage = page > 0;
  const showPagination =
    (searchBlogs?.total_blogs ?? 0) > SEARCH_POSTS_PER_PAGE;

  return (
    <>
      {!blogs || blogs === null ? (
        <p className='py-2 text-sm opacity-90 text-center'>
          No posts found for your search
        </p>
      ) : (
        <div className='max-w-4xl'>
          <div className='flex flex-col gap-4 pb-4'>
            {blogs.map((blog) => {
              return <FeedBlogCard blog={blog} key={blog?.blog_id} />;
            })}
          </div>

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
        </div>
      )}
    </>
  );
};
