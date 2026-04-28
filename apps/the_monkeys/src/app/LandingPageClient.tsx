'use client';

import { Suspense } from 'react';

import AdUnit from '@/components/AdSense/AdUnit';
import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
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
import { useFeatureIsOn } from '@growthbook/growthbook-react';

import CategorySection from './feed/sections/CategorySection';
import CategorySectionCompact from './feed/sections/CategorySectionCompact';
import TrendingSection from './feed/sections/TrendingSection';

const LandingPageClient = () => {
  const { blogs, isError, isLoading } = useGetMetaFeedBlogs({
    limit: 30,
  });

  const filteredBlogs = blogs?.blogs?.filter(
    (blog) => blog?.first_image && blog?.tags?.length
  );

  const devTest = useFeatureIsOn('gb-test');

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (isError || !filteredBlogs || filteredBlogs.length === 0) {
    return (
      <div className='px-4 py-20 flex flex-col items-center justify-center bg-background-light dark:bg-background-dark rounded-xl border-1 border-border-light dark:border-border-dark/10'>
        <div className='p-6 flex items-center gap-2'>
          <p className='font-newsreader font-bold text-8xl text-text-light dark:text-text-dark'>
            4
          </p>
          <div className='bg-brand-orange/10 p-4 rounded-full'>
            <Icon
              name='RiErrorWarning'
              size={60}
              className='text-brand-orange'
            />
          </div>
          <p className='font-newsreader font-bold text-8xl text-text-light dark:text-text-dark'>
            4
          </p>
        </div>

        <h2 className='mt-6 font-newsreader font-bold text-3xl text-text-light dark:text-text-dark text-center'>
          Something went wrong.
        </h2>

        <p className='mt-3 text-lg font-inter text-gray-500 dark:text-gray-400 text-center max-w-md'>
          We couldnIt&apos;t find the feed. Please try refreshing or come back
          later.
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      {devTest && (
        <div className='bg-alert-green/20 text-alert-green text-center py-1 text-sm'>
          <p>GrowthBook Feature Testing Enabled</p>
        </div>
      )}
      <h1 className='text-2xl font-bold hidden'>
        Monkeys - Quality Blogging Community for Technology, Business, Science,
        Lifestyle, Philosophy, and More
      </h1>

      {/* Load Trending section first */}
      {/* <Suspense fallback={<FeedSkeleton />}>
        <TrendingSection blogs={filteredBlogs} />
      </Suspense> */}

      {/* Load Category section in parallel */}
      {/* <div className='space-y-8'>
        {orderedCategories.map(({ title, category }, index) => (
          <Suspense key={index} fallback={<FeedCategorySectionSkeleton />}>
            <CategorySection title={title} category={category} />
          </Suspense>
        ))}
      </div> */}

      {/* Ad Unit -> Home Page */}
      <AdUnit slot='3779794725' />

      {/* <Container className='mt-8 grid grid-cols-2 gap-8'>
        {orderedCompactCategories.map(({ title, category }, index) => (
          <Suspense key={index} fallback={<FeedCategorySectionSkeleton />}>
            <div className='col-span-2 lg:col-span-1'>
              <CategorySectionCompact title={title} category={category} />
            </div>
          </Suspense>
        ))}
      </Container> */}
      <div className='flex flex-col'>
        {blogs && blogs?.blogs.length > 0 && (
          <FeedBlogCard
            blog={blogs.blogs[0]}
            variant='horizontal'
            key={blogs.blogs[0]?.blog_id}
          />
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6'>
          {blogs &&
            blogs?.blogs.slice(1).map((blog) => {
              return <FeedBlogCard blog={blog} key={blog?.blog_id} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default LandingPageClient;
