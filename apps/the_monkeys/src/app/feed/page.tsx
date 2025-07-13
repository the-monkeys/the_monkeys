'use client';

import { useEffect, useMemo, useState } from 'react';

import { Loader } from '@/components/loader';
import axiosInstanceNoAuthV2 from '@/services/api/axiosInstanceNoAuthV2';
import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';

import CategorySection from './sections/CategorySection';
import TrendingSection from './sections/TrendingSection';

const BlogFeedPage = () => {
  const [blogs, setBlogs] = useState<GetMetaFeedBlogs>({ blogs: [] });

  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState(false);

  let hasFetched = false;

  const fetchBlogs = async () => {
    try {
      setBlogsLoading(true);
      setBlogsError(false);

      const response = await axiosInstanceNoAuthV2.post(`/blog/meta-feed`, {});

      setBlogs(response.data);
    } catch (err: unknown) {
      setBlogsLoading(false);
      setBlogsError(true);
    } finally {
      setBlogsLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched) return;
    hasFetched = true;

    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs?.blogs?.filter(
      (blog) => blog?.first_image && blog?.tags?.length
    );
  }, [blogs]);

  if (blogsLoading) {
    return (
      <div className='py-10 flex items-center justify-center'>
        <Loader className='text-brand-orange' size={62} />
      </div>
    );
  }

  if (
    !blogsLoading &&
    (blogsError || !filteredBlogs || filteredBlogs.length === 0)
  ) {
    return (
      <div className='col-span-3 min-h-screen flex flex-col items-center justify-center space-y-3 py-10'>
        <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>
          Oops! Something went wrong.
        </h2>
        {blogsError ? (
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            We couldn&apos;t load the blog feed right now. Please try again
            later.
          </p>
        ) : (
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            No blogs to display at the moment.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <TrendingSection blogs={filteredBlogs} />

      <div>
        <CategorySection category='Tech & Innovation' />
      </div>

      <div>
        <CategorySection category='Business & Finance' />
      </div>

      <div>
        <CategorySection category='AI' />
      </div>

      <div>
        <CategorySection category='Sports & Entertainment' />
      </div>

      <div>
        <CategorySection category='Science & History' />
      </div>
    </div>
  );
};

export default BlogFeedPage;
