import Link from 'next/link';

import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import moment from 'moment';

import ProfileImage, { ProfileFrame } from '../profileImage';
import {
  UserInfoCardCompactSkeleton,
  UserInfoCardSkeleton,
} from '../skeletons/userSkeleton';
import { Skeleton } from '../ui/skeleton';

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
          {moment(date).format('MMM DD, YYYY')}
        </p>
      </div>
    </div>
  );
};

export const UserInfoCardShowcase = ({
  id,
  date,
}: {
  id?: string;
  date?: number | string;
}) => {
  const { user, isLoading, isError } = useGetProfileInfoById(id);

  if (isLoading) return <Skeleton className='h-4 w-32 !rounded-none' />;

  if (isError) {
    return null;
  }

  const userData = user?.user;

  return (
    <div className='flex items-center gap-1'>
      <p className='font-dm_sans font-light text-sm opacity-80'>By</p>

      <Link
        href={`/${userData?.username}`}
        className='font-dm_sans text-sm hover:underline underline-offset-2 decoration-1'
      >
        {userData?.first_name} {userData?.last_name}
      </Link>

      <p className='font-dm_sans font-light text-sm opacity-80'>
        on {moment(date).format('MMM DD, YYYY')}
      </p>
    </div>
  );
};

export const UserInfoCardBlogPage = ({
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
      <div className='flex items-center gap-[6px]'>
        <div>
          <ProfileFrame className='size-[38px] !rounded-none'>
            <ProfileImage username={userData?.username} />
          </ProfileFrame>
        </div>

        <div className='flex flex-col justify-center overflow-hidden space-y-[2px]'>
          <div>
            <Link
              href={`/${userData?.username}`}
              className='font-dm_sans font-medium text-sm hover:underline decoration-1'
            >
              {userData?.first_name} {userData?.last_name}
            </Link>
          </div>

          <div className='flex items-end text-sm gap-1'>
            <p className='opacity-80'>Posted on:</p>
            <p className='opacity-80'>
              {moment(date).format('MMM DD, yyyy')}
              {' / '}
              {moment(date).utc().format('hh:mm A')} UTC
            </p>
          </div>
        </div>
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
