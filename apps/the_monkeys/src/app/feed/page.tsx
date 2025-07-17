'use client';

import { useEffect, useMemo, useState } from 'react';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import { Loader } from '@/components/loader';
import {
  orderedCategories,
  orderedCompactCategories,
} from '@/config/categoryConfig';
import axiosInstanceNoAuthV2 from '@/services/api/axiosInstanceNoAuthV2';
import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';

import CategorySection from './sections/CategorySection';
import CategorySectionCompact from './sections/CategorySectionCompact';
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
      <div className='px-4 py-10 flex flex-col justify-center items-center'>
        <Loader className='text-brand-orange' size={52} />
        <p className='py-2 font-dm_sans text-base'>
          Fetching latest posts for you...
        </p>
      </div>
    );
  }

  if (
    !blogsLoading &&
    (blogsError || !filteredBlogs || filteredBlogs.length === 0)
  ) {
    return (
      <div className='px-4 py-10 flex flex-col items-center justify-center'>
        <div className='p-2'>
          <Icon name='RiErrorWarning' size={50} className='text-alert-red' />
        </div>

        <h2 className='font-dm_sans text-xl'>
          Feed unavailable. Sorry for the inconvenience.
        </h2>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <TrendingSection blogs={filteredBlogs} />

      <div className='mt-10 space-y-8'>
        {orderedCategories.map(({ title, category }, index) => {
          return (
            <CategorySection title={title} category={category} key={index} />
          );
        })}
      </div>

      <Container className='mt-8 grid grid-cols-2 gap-8'>
        {orderedCompactCategories.map(({ title, category }, index) => {
          return (
            <div className='col-span-2 md:col-span-1' key={index}>
              <CategorySectionCompact title={title} category={category} />
            </div>
          );
        })}
      </Container>
    </div>
  );
};

export default BlogFeedPage;
