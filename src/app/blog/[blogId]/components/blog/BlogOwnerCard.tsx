'use client';

import Link from 'next/link';

import ProfileImage from '@/components/profileImage';
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
        <div className='size-12 ring-1 ring-secondary-lightGrey/25 flex items-center justify-center overflow-hidden rounded-full'>
          <ProfileImage firstName={user.first_name} username={user?.username} />
        </div>
      )}

      <div>
        <Link
          href={`/${user?.username}`}
          className='font-josefin_Sans text-lg md:text-xl capitalize hover:underline'
        >
          {user?.first_name} {user?.last_name}{' '}
        </Link>

        <p className='font-jost text-sm'>
          <span className='opacity-75'>Last Updated on</span>{' '}
          {moment(time).format('MMM DD, YYYY')}
        </p>
      </div>
    </div>
  );
};
