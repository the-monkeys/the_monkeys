'use client';

import { useMemo } from 'react';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import { Loader } from '@/components/loader';
import { SearchInput } from '@/components/search/SearchInput';
import {
  FeedBlogCardListSkeleton,
  ShowcaseBlogCardListSkeleton,
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
  const { blogs, isError, isLoading } = useGetMetaFeedBlogs({ limit: 50 });

  const filteredBlogs = useMemo(() => {
    return blogs?.blogs?.filter(
      (blog) => blog?.first_image && blog?.tags?.length
    );
  }, [blogs]);

  if (isLoading) {
    return <ShowcaseBlogCardListSkeleton />;
  }

  if (isError || !filteredBlogs || filteredBlogs.length === 0) {
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

      {/* TODO: optimize category section */}

      <div className='space-y-8'>
        {orderedCategories.map(({ title, category }, index) => {
          return (
            <CategorySection title={title} category={category} key={index} />
          );
        })}
      </div>

      <Container className='mt-8 grid grid-cols-2 gap-8'>
        {orderedCompactCategories.map(({ title, category }, index) => {
          return (
            <div className='col-span-2 lg:col-span-1' key={index}>
              <CategorySectionCompact title={title} category={category} />
            </div>
          );
        })}
      </Container>
    </div>
  );
};

export default BlogFeedPage;
