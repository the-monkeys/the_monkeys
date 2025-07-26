import { useEffect, useState } from 'react';

import axiosInstanceNoAuthV2 from '@/services/api/axiosInstanceNoAuthV2';
import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { useBlogStore } from '@/store/useBlogStore';

import { SearchBlogCard } from '../cards/blog/SearchBlogCard';
import LinksRedirectArrow from '../links/LinksRedirectArrow';
import { SearchResultSkeleton } from '../skeletons/searchSkeleton';

export const SearchPosts = ({ query }: { query: string }) => {
  const [blogs, setBlogs] = useState<GetMetaFeedBlogs>({ blogs: [] });

  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState(false);

  const { blogCache, setBlogCache } = useBlogStore();
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const fetchBlogs = async () => {
      setBlogsLoading(true);
      setBlogsError(false);

      if (blogCache.has(trimmedQuery)) {
        setBlogs(blogCache.get(trimmedQuery)!);
        setBlogsLoading(false);
        return;
      }

      try {
        const response = await axiosInstanceNoAuthV2.post(`/blog/search`, {
          search_query: trimmedQuery,
        });

        setBlogCache(trimmedQuery, response.data);
        setBlogs(response.data);
      } catch (err: unknown) {
        setBlogsError(true);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, [query]);

  if (blogsLoading) {
    return <SearchResultSkeleton />;
  }

  if (
    !blogsLoading &&
    (blogsError || !blogs?.blogs || blogs?.blogs.length === 0)
  ) {
    return (
      <div className='p-2 flex items-center justify-center'>
        <p className='opacity-90'>No results found.</p>
      </div>
    );
  }
  return (
    <div className='space-y-[10px]'>
      <div className='flex flex-col divide-y-1 divide-border-light dark:divide-border-dark'>
        {blogs?.blogs.slice(0, 3).map((blog) => {
          return <SearchBlogCard blog={blog} key={blog?.blog_id} />;
        })}
      </div>

      <div className='flex justify-end'>
        <LinksRedirectArrow link={`/search?${query}`} className='p-1'>
          <p className='text-sm'>See all results</p>
        </LinksRedirectArrow>
      </div>
    </div>
  );
};
