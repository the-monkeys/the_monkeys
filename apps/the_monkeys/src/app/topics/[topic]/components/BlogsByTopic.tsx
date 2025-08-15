'use client';

import { useEffect, useState } from 'react';

import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import axiosInstanceNoAuthV2 from '@/services/api/axiosInstanceNoAuthV2';
import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';

export const BlogsByTopic = ({ topic }: { topic: string }) => {
  const [blogs, setBlogs] = useState<GetMetaFeedBlogs>({ blogs: [] });

  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setBlogsLoading(true);
      setBlogsError(false);

      try {
        const response = await axiosInstanceNoAuthV2.post(`/blog/meta-feed`, {
          tags: [topic],
        });

        setBlogs(response.data);
      } catch (err: unknown) {
        setBlogsError(true);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

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
    <div className='flex flex-col gap-8'>
      {blogs.blogs.map((blog) => {
        return <FeedBlogCard blog={blog} key={blog?.blog_id} />;
      })}
    </div>
  );
};
