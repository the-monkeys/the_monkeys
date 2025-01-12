import Link from 'next/link';

import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import moment from 'moment';

import ProfileImage, { ProfileFrame } from '../profileImage';
import {
  UserInfoCardCompactSkeleton,
  UserInfoCardSkeleton,
} from '../skeletons/userSkeleton';

export const UserInfoCardCompact = ({
  id,
  date,
}: {
  id?: string;
  date?: number | string;
}) => {
  const { user, isLoading, isError } = useGetProfileInfoById(id);

  if (isLoading) return <UserInfoCardCompactSkeleton />;

  if (isError) {
    return <p className='mb-4 text-sm opacity-80'>User not available</p>;
  }

  const userData = user?.user;

  return (
    <div className='w-full flex items-center gap-2'>
      <Link href={`/${userData?.username}`} className='hover:opacity-80'>
        <ProfileFrame className='size-5 border-none'>
          <ProfileImage username={userData?.username} />
        </ProfileFrame>
      </Link>

      <div className='flex gap-1 justify-center flex-wrap'>
        <Link
          href={`/${userData?.username}`}
          className='font-dm_sans font-medium text-[13px] hover:underline decoration-1'
        >
          {userData?.first_name} {userData?.last_name}
        </Link>

        <span className='text-sm cursor-default'>·</span>

        <p className='font-dm_sans text-[13px] opacity-80 cursor-default'>
          {moment(date).format('MMM DD')}
        </p>
      </div>
    </div>
  );
};

export const UserInfoCard = ({
  id,
  date,
}: {
  id?: string;
  date?: number | string;
}) => {
  const { user, isLoading, isError } = useGetProfileInfoById(id);

  if (isLoading) return <UserInfoCardSkeleton />;

  if (isError) {
    return <p className='mb-4 text-sm opacity-80'>User not available</p>;
  }

  const userData = user?.user;

  return (
    <div className='w-full flex items-center gap-2'>
      <Link href={`/${userData?.username}`} className='hover:opacity-80'>
        <ProfileFrame className='size-[35px]'>
          <ProfileImage username={userData?.username} />
        </ProfileFrame>
      </Link>

      <div className='flex flex-col justify-center overflow-hidden'>
        <Link
          href={`/${userData?.username}`}
          className='font-dm_sans font-medium text-sm hover:underline decoration-1'
        >
          {userData?.first_name} {userData?.last_name}
        </Link>

        <div className='flex gap-1'>
          <p className='font-dm_sans text-[13px] opacity-80 cursor-default'>
            {moment(date).format('MMMM DD, yyyy')}
          </p>

          <span className='hidden sm:block text-sm cursor-default'>·</span>

          <p className='hidden sm:block font-dm_sans text-[13px] opacity-80 cursor-default'>{`@${userData?.username}`}</p>
        </div>
      </div>
    </div>
  );
};
