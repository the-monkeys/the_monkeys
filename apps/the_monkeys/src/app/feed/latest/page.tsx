'use client';

import { ContributeAndSponsorCard } from '@/components/branding/sponsor/ContributeAndSponsorCard';

import LatestBlogs from '../components/blogFeed/LatestBlogs';

export default function BlogFeed() {
  return (
    <>
      <h1 className='lg:px-6 text-display text-brand-orange'>
        Latest on Monkeys
      </h1>
      <div className='mt-6 md:mt-8 grid grid-cols-3 gap-6'>
        <div className='col-span-3 md:col-span-2'>
          <LatestBlogs />
        </div>

        <div className='hidden md:block col-span-3 md:col-span-1'>
          <ContributeAndSponsorCard />
        </div>
      </div>
    </>
  );
}
