import Link from 'next/link';

import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import moment from 'moment';

import Icon from '../icon';
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
    <div className='w-full flex gap-[10px]'>
      <Link href={`/${userData?.username}`} className='hover:opacity-90'>
        <ProfileFrame className='mt-1 size-10 sm:size-12 ring-1 ring-border-light/40 dark:ring-border-dark/40'>
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

        <div className='pt-1 flex items-center gap-2 flex-wrap'>
          <p className='text-sm font-medium'>
            {user?.followers ? user.followers : '0'}{' '}
            <span className='font-normal opacity-80'>Followers</span>
          </p>

          {userData?.location && (
            <div className='flex items-center gap-1'>
              <Icon name='RiMapPinUser' size={16} type='Fill' />

              <p className='text-sm opacity-80'>{userData.location}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const UserInfoCardShowcase = ({
  authorID,
  date,
  isDraft = false,
}: {
  authorID?: string;
  date?: number | string;
  isDraft?: boolean;
}) => {
  const { user, isLoading, isError } = useGetProfileInfoById(authorID);

  const userData = user?.user;

  return (
    <div className='flex items-center gap-1 flex-wrap'>
      {!isLoading ? (
        isError ? (
          <p className='shrink-0 text-sm opacity-90 italic'>Author Unknown</p>
        ) : (
          <Link
            href={`/${userData?.username}`}
            className='shrink-0 text-sm hover:underline'
          >
            {userData?.first_name}{' '}
            {userData?.last_name ? userData?.last_name : ''}
          </Link>
        )
      ) : (
        <Skeleton className='h-3 w-28' />
      )}

      {!isDraft && (
        <>
          <span className='text-sm opacity-80'>{' — '}</span>

          <p className='shrink-0 text-sm opacity-90'>
            {moment(date).format('MMM DD, YYYY')}
          </p>
        </>
      )}
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
      <p className='text-sm opacity-90'>by</p>

      <div className='shrink-0'>
        <ProfileFrame className='size-7 shadow-sm'>
          <ProfileImage username={userData?.username} />
        </ProfileFrame>
      </div>

      <div>
        <Link
          href={`/${userData?.username}`}
          className='font-medium text-sm md:text-base hover:underline'
        >
          {userData?.first_name}{' '}
          {userData?.last_name ? userData?.last_name : ''}
        </Link>
      </div>
    </div>
  );
};
