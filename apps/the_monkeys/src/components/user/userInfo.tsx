import Link from 'next/link';

import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import moment from 'moment';

import ProfileImage, { ProfileFrame } from '../profileImage';
import {
  UserInfoCardSkeleton,
  UserRecommendationCardSkeleton,
} from '../skeletons/userSkeleton';

export const RecommendedUserCard = ({ id }: { id?: string }) => {
  const { user, isLoading, isError } = useGetProfileInfoById(id);

  if (isLoading) return <UserRecommendationCardSkeleton />;

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
          {userData?.first_name}{' '}
          {userData?.last_name ? userData?.last_name : ''}
        </Link>

        <span className='text-sm opacity-90 line-clamp-2'>{userData?.bio}</span>
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

  if (isError) {
    return null;
  }

  const userData = user?.user;

  return (
    <div className='flex items-center gap-1 flex-wrap'>
      {!isLoading ? (
        isError ? null : (
          <Link
            href={`/${userData?.username}`}
            className='shrink-0 text-sm hover:underline'
          >
            {userData?.first_name}{' '}
            {userData?.last_name ? userData?.last_name : ''}
          </Link>
        )
      ) : (
        <Skeleton className='h-4 w-28' />
      )}

      {!isError && <span className='text-sm opacity-80'>{' — '}</span>}

      <p className='shrink-0 text-sm'>{moment(date).format('MMM DD, YYYY')}</p>
    </div>
  );
};

export const UserInfoCardBlogPage = ({ id }: { id?: string }) => {
  const { user, isLoading, isError } = useGetProfileInfoById(id);

  if (isLoading) return <UserInfoCardSkeleton />;

  if (isError) {
    return <p className='text-sm opacity-80'>User not available</p>;
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
        {userData?.first_name} {userData?.last_name ? userData?.last_name : ''}
      </Link>
    </div>
  );
};
