import { useEffect, useState } from 'react';

import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import axiosInstanceNoAuthV2 from '@/services/api/axiosInstanceNoAuthV2';
import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { useBlogStore } from '@/store/useBlogStore';

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
    return <FeedBlogCardListSkeleton />;
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
    <div className='flex flex-col space-y-6 sm:space-y-8'>
      {blogs?.blogs.map((blog) => {
        return <FeedBlogCard blog={blog} key={blog?.blog_id} />;
      })}
    </div>
  );
};
