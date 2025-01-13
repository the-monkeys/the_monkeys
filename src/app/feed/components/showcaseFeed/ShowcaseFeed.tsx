'use client';

import { Suspense } from 'react';

import { ShowcaseBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import moment from 'moment';

import { NewsCategories } from './components/NewsCategories';
import { NewsGrid } from './components/NewsGrid';
import { ShowcaseBlogs } from './components/ShowcaseBlogs';

export const ShowcaseFeed = () => {
  const currDate = new Date();

  return (
    <div className='pb-12'>
      <div className='py-6'>
        <p className='font-dm_sans font-medium text-sm text-right'>
          {moment(currDate).format('dddd')}
        </p>

        <p className='text-xs md:text-sm opacity-80 text-right'>
          {`${moment(currDate).format('MMM DD, YYYY')} | ${moment(currDate).utc().format('hh:mm')} UTC`}
        </p>
      </div>

      <Suspense fallback={<ShowcaseBlogCardListSkeleton />}>
        <ShowcaseBlogs />
      </Suspense>

      <Suspense fallback={null}>
        <NewsCategories />
      </Suspense>

      <Suspense fallback={null}>
        <NewsGrid />
      </Suspense>
    </div>
  );
};
