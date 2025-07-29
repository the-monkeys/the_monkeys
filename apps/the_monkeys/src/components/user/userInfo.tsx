import Link from 'next/link';

import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import moment from 'moment';

import ProfileImage, { ProfileFrame } from '../profileImage';
import {
  UserInfoCardCompactSkeleton,
  UserInfoCardSkeleton,
} from '../skeletons/userSkeleton';

export const RecommendedUserCard = ({ id }: { id?: string }) => {
  const { user, isLoading, isError } = useGetProfileInfoById(id);

  if (isLoading) return <UserInfoCardCompactSkeleton />;

  if (isError) {
    return null;
  }

  const userData = user?.user;

  return (
    <div className='w-full flex gap-3'>
      <Link href={`/${userData?.username}`} className='hover:opacity-80'>
        <ProfileFrame className='size-10 ring-1 ring-border-light/40 dark:ring-border-dark/40'>
          <ProfileImage username={userData?.username} />
        </ProfileFrame>
      </Link>

      <div className='space-y-[6px]'>
        <Link
          href={`/${userData?.username}`}
          className='font-medium hover:underline'
        >
          {userData?.first_name} {userData?.last_name}
        </Link>

        <span className='text-sm opacity-90 line-clamp-2'>{userData?.bio}</span>
      </div>
    </div>
  );
};

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
        <ProfileFrame className='size-5'>
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
  authorID,
  date,
}: {
  authorID?: string;
  date?: number | string;
}) => {
  const { user, isLoading, isError } = useGetProfileInfoById(authorID);

  if (isLoading) return <Skeleton className='mb-1 h-4 w-32' />;

  if (isError) {
    return null;
  }

  const userData = user?.user;

  return (
    <div className='flex items-center gap-1 flex-wrap'>
      <Link
        href={`/${userData?.username}`}
        className='shrink-0 text-sm hover:underline'
      >
        {userData?.first_name} {userData?.last_name}
      </Link>

      <p className='shrink-0 text-sm'>
        {' · '}
        {moment(date).format('MMM DD, YYYY')}
      </p>
    </div>
  );
};

export const UserInfoCardBlogPage = ({ id }: { id?: string }) => {
  const { user, isLoading, isError } = useGetProfileInfoById(id);

  if (isLoading) return <UserInfoCardSkeleton />;

  if (isError) {
    return <p className='mb-4 text-sm opacity-80'>User not available</p>;
  }

  const userData = user?.user;

  return (
    <div className='flex items-center overflow-x-hidden gap-[6px]'>
      <p className='text-sm'>by</p>

      <div className='shrink-0 p-[2px]'>
        <ProfileFrame className='size-6 shadow-sm'>
          <ProfileImage username={userData?.username} />
        </ProfileFrame>
      </div>

      <Link
        href={`/${userData?.username}`}
        className='font-medium text-sm md:text-base hover:underline'
      >
        {userData?.first_name} {userData?.last_name}
      </Link>
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
        <ProfileFrame className='size-[35px] !rounded-sm'>
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
