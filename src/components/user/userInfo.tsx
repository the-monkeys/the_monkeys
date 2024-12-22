import Link from 'next/link';

import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import moment from 'moment';

import ProfileImage, { ProfileFrame } from '../profileImage';
import {
  UserInfoCardCompactSkeleton,
  UserInfoCardSkeleton,
} from '../skeletons/userSkeleton';

export const UserInfoCardCompact = ({ id }: { id?: string }) => {
  const { user, isLoading, isError } = useGetProfileInfoById(id);

  if (isLoading) return <UserInfoCardCompactSkeleton />;

  if (isError) {
    return (
      <p className='mb-4 font-roboto text-sm opacity-80'>User not available</p>
    );
  }

  const userData = user?.user;

  return (
    <div className='w-full flex items-center gap-2'>
      {userData && (
        <ProfileFrame className='size-5 lg:size-6'>
          <ProfileImage
            firstName={userData.first_name}
            username={userData.username}
          />
        </ProfileFrame>
      )}

      <Link
        href={`/${userData?.username}`}
        className='font-dm_sans font-medium text-xs sm:text-sm hover:opacity-80'
      >
        {userData?.first_name} {userData?.last_name}
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
      <p className='py-2 font-roboto text-sm opacity-80'>User not available</p>
    );

  const userData = user?.user;

  return (
    <div className='w-fit flex items-center flex-wrap gap-2'>
      {userData && (
        <ProfileFrame className='size-10'>
          <ProfileImage
            firstName={userData.first_name}
            username={userData?.username}
          />
        </ProfileFrame>
      )}

      <div className='flex-1'>
        <Link
          href={`/${userData?.username}`}
          className='font-dm_sans font-medium text-sm sm:text-base hover:opacity-80'
        >
          {userData?.first_name} {userData?.last_name}
        </Link>

        <p className='font-roboto text-xs opacity-80'>
          {moment(date).format('MMM DD, YYYY')}
        </p>
      </div>
    </div>
  );
};
