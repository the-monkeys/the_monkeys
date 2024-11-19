'use client';

import Link from 'next/link';

import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { BlogOwnerInfoSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetProfileInfoById from '@/hooks/useGetProfileInfoByUserId';
import moment from 'moment';

export const BlogOwnerCard = ({
  owner_id,
  time,
}: {
  owner_id?: string;
  time?: number;
}) => {
  const { user, isLoading, isError } = useGetProfileInfoById(owner_id);

  if (isLoading) {
    return <BlogOwnerInfoSkeleton />;
  }

  if (isError)
    return (
      <p className='py-4 font-jost text-sm text-alert-red'>
        User not available
      </p>
    );

  return (
    <div className='flex items-center flex-wrap gap-2'>
      {user && (
        <ProfileFrame className='size-12'>
          <ProfileImage firstName={user.first_name} username={user?.username} />
        </ProfileFrame>
      )}

      <div className='flex-1 flex items-center gap-x-1 flex-wrap'>
        <Link
          href={`/${user?.username}`}
          className='font-josefin_Sans text-base md:text-lg capitalize hover:underline'
        >
          {user?.first_name} {user?.last_name}
        </Link>

        <span className='opacity-75'>·</span>

        <button
          className='text-base md:text-lg font-josefin_Sans text-primary-monkeyOrange opacity-75 hover:opacity-100'
          disabled={true}
        >
          Follow
        </button>

        <p className='w-full font-jost text-xs md:text-sm opacity-75'>
          {`@${user?.username}`}
          <span className='mx-1'>·</span>
          {moment(time).format('MMM DD, YYYY')}
        </p>
      </div>
    </div>
  );
};
