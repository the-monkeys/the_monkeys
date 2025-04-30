'use client';

import moment from 'moment';

import LatestBlogs from '../blogFeed/LatestBlogs';
import { LatestBlogsCard } from '../blogFeed/LatestBlogsCard';
import { NewsCategories } from './components/NewsCategories';
import { NewsGrid } from './components/NewsGrid';
import { ShowcaseBlogs } from './components/ShowcaseBlogs';

export const ShowcaseFeed = () => {
  const currDate = new Date();

  return (
    <div className='pb-12'>
      <div className='py-6'>
        <p className='font-dm_sans font-medium text-right'>
          {moment(currDate).format('dddd')}
        </p>

        <p className='text-xs md:text-sm opacity-80 text-right'>
          {`${moment(currDate).format('MMMM DD, YYYY')} | ${moment(currDate).utc().format('hh:mm')} UTC`}
        </p>
      </div>

      <div className='grid grid-cols-12 gap-4'>
        <div className='px-8 grid'>
          <LatestBlogs />
        </div>
        <div className='col-start-1 col-end-13 lg:col-start-9'>
          <LatestBlogsCard />
        </div>
      </div>
      {/*<ShowcaseBlogs />

      <NewsCategories />*/}

      {/* <NewsGrid /> */}
    </div>
  );
};
