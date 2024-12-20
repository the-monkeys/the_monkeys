import Link from 'next/link';

import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import moment from 'moment';

import ProfileImage, { ProfileFrame } from '../profileImage';
import {
  UserInfoCardCompactSkeleton,
  UserInfoCardSkeleton,
} from '../skeletons/userSkeleton';
import { FollowButtonCompact } from './buttons/followButton';

export const UserInfoCardCompact = ({ id }: { id?: string }) => {
  const { user, isLoading, isError } = useGetProfileInfoById(id);

  if (isLoading) return <UserInfoCardCompactSkeleton />;

  if (isError) {
    return (
      <p className='mb-4 font-roboto text-sm opacity-80'>User not available</p>
    );
  }

  return (
    <div className='w-full flex items-center gap-1'>
      {user && (
        <ProfileFrame className='size-5 lg:size-6'>
          <ProfileImage firstName={user.first_name} username={user?.username} />
        </ProfileFrame>
      )}

      <Link
        href={`/${user?.username}`}
        className='font-dm_sans text-xs lg:text-sm hover:opacity-80'
      >
        {user?.first_name} {user?.last_name}
      </Link>
    </div>
  );
};

export const UserInfoCard = ({ id, date }: { id?: string; date?: number }) => {
  const { user, isLoading, isError } = useGetProfileInfoById(id);

  if (isLoading) {
    return <UserInfoCardSkeleton />;
  }

  if (isError)
    return (
      <p className='py-4 font-roboto text-sm opacity-80'>User not available</p>
    );

  return (
    <div className='flex items-center flex-wrap gap-2 overflow-hidden'>
      {user && (
        <ProfileFrame className='size-12'>
          <ProfileImage firstName={user.first_name} username={user?.username} />
        </ProfileFrame>
      )}

      <div className='flex-1'>
        <div className='flex items-center gap-1'>
          <Link
            href={`/${user?.username}`}
            className='font-dm_sans text-sm md:text-base hover:opacity-80'
          >
            {user?.first_name} {user?.last_name}
          </Link>

          <FollowButtonCompact username={user?.username} />
        </div>

        <p className='font-roboto text-xs opacity-80'>
          {moment(date).format('MMM DD, YYYY')}
        </p>
      </div>
    </div>
  );
};
