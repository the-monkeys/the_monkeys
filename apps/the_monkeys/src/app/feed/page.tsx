'use client';

import { Suspense, useMemo } from 'react';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import {
  FeedCategorySectionSkeleton,
  FeedSkeleton,
} from '@/components/skeletons/blogSkeleton';
import {
  orderedCategories,
  orderedCompactCategories,
} from '@/config/categoryConfig';
import useGetMetaFeedBlogs from '@/hooks/blog/useGetMetaFeedBlogs';

import CategorySection from './sections/CategorySection';
import CategorySectionCompact from './sections/CategorySectionCompact';
import TrendingSection from './sections/TrendingSection';

const BlogFeedPage = () => {
  const { blogs, isError, isLoading } = useGetMetaFeedBlogs({ limit: 30 });

  const filteredBlogs = useMemo(() => {
    return blogs?.blogs?.filter(
      (blog) => blog?.first_image && blog?.tags?.length
    );
  }, [blogs]);

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (isError || !filteredBlogs || filteredBlogs.length === 0) {
    return (
      <div className='px-4 py-12 flex flex-col items-center justify-center'>
        <div className='p-4 flex items-center'>
          <p className='font-dm_sans font-bold text-6xl'>4</p>
          <Icon name='RiErrorWarning' size={50} className='text-alert-red' />
          <p className='font-dm_sans font-bold text-6xl'>4</p>
        </div>

        <h2 className='py-1 font-dm_sans font-medium text-lg text-center'>
          Page not found — but at least you found us!
        </h2>

        <p className='text-base opacity-90 text-center'>
          Try refreshing, or swing by again later.
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <h1 className='text-2xl font-bold hidden'>
        Monkeys - Quality Blogging Community for Technology, Business, Science,
        Lifestyle, Philosophy, and More
      </h1>

      <Suspense fallback={<FeedSkeleton />}>
        <TrendingSection blogs={filteredBlogs} />
      </Suspense>

      <div className='space-y-8'>
        {orderedCategories.map(({ title, category }, index) => (
          <Suspense key={index} fallback={<FeedCategorySectionSkeleton />}>
            <CategorySection title={title} category={category} />
          </Suspense>
        ))}
      </div>

      <Container className='mt-8 grid grid-cols-2 gap-8'>
        {orderedCompactCategories.map(({ title, category }, index) => (
          <Suspense key={index} fallback={<FeedCategorySectionSkeleton />}>
            <div className='col-span-2 lg:col-span-1'>
              <CategorySectionCompact title={title} category={category} />
            </div>
          </Suspense>
        ))}
      </Container>
    </div>
  );
};

export default BlogFeedPage;
