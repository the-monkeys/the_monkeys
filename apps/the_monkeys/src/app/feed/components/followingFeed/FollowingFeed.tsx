'use client';

import { ContributeAndSponsorCard } from '@/components/branding/sponsor/ContributeAndSponsorCard';
import useAuth from '@/hooks/auth/useAuth';

import { FollowingBlogs } from './FollowingBlogs';

export const FollowingFeed = () => {
  const { isSuccess } = useAuth();

  return (
    <div className='mt-6 md:mt-8 grid grid-cols-3 gap-6'>
      <div className='col-span-3 md:col-span-2'>
        <FollowingBlogs isAuthenticated={isSuccess} />
      </div>

      <div className='hidden md:block col-span-3 md:col-span-1'>
        <ContributeAndSponsorCard />
      </div>
    </div>
  );
};
