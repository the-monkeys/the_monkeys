'use client';

import moment from 'moment';

import { NewsCategories } from './components/NewsCategories';
import { NewsGrid } from './components/NewsGrid';
import { ShowcaseBlogs } from './components/ShowcaseBlogs';

export const ShowcaseFeed = () => {
  const currDate = new Date();

  return (
    <div className='pb-12'>
      <div className='py-6'>
        <p className='font-dm_sans font-medium text-sm'>
          {moment(currDate).format('dddd')}
        </p>

        <p className='text-sm opacity-80'>
          {`${moment(currDate).format('MMM DD, YYYY')} | ${moment(currDate).utc().format('hh:mm')} UTC`}
        </p>
      </div>

      <ShowcaseBlogs />

      <NewsCategories />

      <NewsGrid />
    </div>
  );
};
