'use client';

import { Suspense } from 'react';

import { ContributeAndSponsorCard } from '@/components/branding/sponsor/ContributeAndSponsorCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { useSession } from 'next-auth/react';

import { FollowingBlogs } from './FollowingBlogs';

export const FollowingFeed = () => {
  const { status } = useSession();

  return (
    <div className='mt-6 md:mt-8 grid grid-cols-3 gap-6'>
      <div className='col-span-3 md:col-span-2'>
        <Suspense fallback={<FeedBlogCardListSkeleton />}>
          <FollowingBlogs status={status} />
        </Suspense>
      </div>

      <div className='hidden md:block col-span-3 md:col-span-1'>
        <ContributeAndSponsorCard />
      </div>
    </div>
  );
};
