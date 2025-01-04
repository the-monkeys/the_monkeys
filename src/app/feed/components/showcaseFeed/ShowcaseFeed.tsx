'use client';

import moment from 'moment';

import { NewsCategories } from './components/NewsCategories';
import { NewsGrid } from './components/NewsGrid';

export const ShowcaseFeed = () => {
  const currDate = new Date();

  return (
    <div className='pb-12 space-y-10'>
      <div className='py-6 space-y-1 text-center md:text-left'>
        <p className='font-dm_sans text-xs opacity-80'>
          {moment(currDate).format('dddd, MMMM DD, YYYY')}
        </p>

        <h2 className='font-arvo text-2xl'>
          Monkeys <span className='text-brand-orange'>Showcase</span>
        </h2>
      </div>

      <div className='grid grid-cols-3 gap-6'>
        <div className='col-span-3 md:col-span-1'>
          <NewsCategories />
        </div>

        <div className='col-span-3 md:col-span-2'>
          <NewsGrid />
        </div>
      </div>
    </div>
  );
};
