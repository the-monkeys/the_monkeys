'use client';

import EditorialHero from '@/components/editorial/EditorialHero';
import FeatureCard from '@/components/editorial/FeatureCard';
import FeaturedAuthorsStrip from '@/components/editorial/FeaturedAuthorsStrip';
import FeedListItem from '@/components/editorial/FeedListItem';
import HorizontalFeatureCard from '@/components/editorial/HorizontalFeatureCard';
import MinimalBlogCard from '@/components/editorial/MinimalBlogCard';
import SectionLabel from '@/components/editorial/SectionLabel';
import Icon from '@/components/icon';
import { FeedSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetMetaFeedBlogs from '@/hooks/blog/useGetMetaFeedBlogs';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

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
      <div className='px-4 py-20 flex flex-col items-center justify-center bg-background-light dark:bg-background-dark rounded-xl '>
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
          We couldn&apos;t find the feed. Please try refreshing or come back
          later.
        </p>
      </div>
    );
  }

  // Editorial composition slots. Each slot picks from the filtered feed in
  // order; sections render only if they have data.
  const hero = filteredBlogs[0];
  const horizontalFeature = filteredBlogs[1];
  const firstList = filteredBlogs.slice(2, 5); // 3 rows
  const featured = filteredBlogs[5];
  const minimalPair = filteredBlogs.slice(6, 8); // 2 cards
  const perspectives = filteredBlogs.slice(8, 12); // 4 rows
  const remainder = filteredBlogs.slice(12);

  // Always-on call-to-action: we are investing in tech research and looking
  // for partners / funders. Click-through goes to the dedicated `/support`
  // page with the full pitch + email contact.

  return (
    <div className='min-h-screen'>
      {devTest && (
        <div className='bg-alert-green/20 text-alert-green text-center py-1 text-sm'>
          <p>GrowthBook Feature Testing Enabled</p>
        </div>
      )}

      <h1 className='text-2xl font-bold hidden sr-only'>
        Monkeys - A Research and Long-form Writing Community
      </h1>

      {/* Featured Authors strip retained; top category navigation untouched. */}
      <FeaturedAuthorsStrip />

      <div className='mt-4'>
        {hero && <EditorialHero blog={hero} badge='Editorial' />}

        {horizontalFeature && (
          <div className='mt-6'>
            <HorizontalFeatureCard blog={horizontalFeature} />
          </div>
        )}

        {firstList.length > 0 && (
          <div className='mt-6'>
            {firstList.map((b) => (
              <FeedListItem key={b.blog_id} blog={b} />
            ))}
          </div>
        )}

        {featured && (
          <>
            <SectionLabel>Weekly Analysis</SectionLabel>
            <FeatureCard blog={featured} />
          </>
        )}

        {minimalPair.length > 0 && (
          <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {minimalPair.map((b, i) => (
              <MinimalBlogCard
                key={b.blog_id}
                blog={b}
                label={i === 0 ? 'Deep Dive' : 'Essay'}
              />
            ))}
          </div>
        )}

        {perspectives.length > 0 && (
          <>
            <SectionLabel>Perspectives</SectionLabel>
            <div>
              {perspectives.map((b) => (
                <FeedListItem key={b.blog_id} blog={b} />
              ))}
            </div>
          </>
        )}

        {remainder.length > 0 && (
          <>
            <SectionLabel>More from the Community</SectionLabel>
            <div>
              {remainder.map((b) => (
                <FeedListItem key={b.blog_id} blog={b} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LandingPageClient;
