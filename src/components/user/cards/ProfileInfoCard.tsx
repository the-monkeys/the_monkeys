import Link from 'next/link';

import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { ProfileInfoCardSkeleton } from '@/components/skeletons/profileSkeleton';
import { Button } from '@/components/ui/button';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import { useSession } from 'next-auth/react';
import { twMerge } from 'tailwind-merge';

import { FollowButtonSecondary } from '../buttons/followButton';

export const ProfileInfoCard = ({
  userId,
  className,
}: {
  userId?: string;
  className?: string;
}) => {
  const { data: session, status } = useSession();
  const { user, isLoading, isError } = useGetProfileInfoById(userId);

  if (isLoading) return <ProfileInfoCardSkeleton />;

  if (isError) return null;

  const userData = user?.user;

  return (
    <div
      className={twMerge(
        className,
        'border-1 border-foreground-light/50 dark:border-foreground-dark/50 rounded-sm overflow-hidden'
      )}
    >
      <div className='mb-[20px] px-4 pt-8 pb-2 w-full flex items-end gap-3 bg-foreground-light/50 dark:bg-foreground-dark/50'>
        <ProfileFrame className='-mb-[20px] size-[85px] ring-2 ring-foreground-light/50 dark:ring-foreground-dark/50'>
          <ProfileImage username={userData?.username} />
        </ProfileFrame>

        <div className='flex-1 overflow-hidden'>
          <p className='font-dm_sans text-sm opacity-80 truncate'>
            {`@${userData?.username}`}
          </p>

          <h2 className='flex-1 font-dm_sans font-medium text-xl capitalize'>
            {`${userData?.first_name} ${userData?.last_name}`}
          </h2>
        </div>
      </div>

      <div className='mt-[20px] px-4 space-y-2'>
        {userData?.bio && (
          <p className='py-1 leading-tight break-words'>{userData.bio}</p>
        )}

        <div className='flex items-center gap-2'>
          <div className='flex gap-1'>
            <p className='text-sm font-medium'>
              {user?.followers ? user.followers : '0'}
            </p>
            <p className='text-sm opacity-80'>Followers</p>
          </div>

          <div className='flex gap-1'>
            <p className='text-sm font-medium'>
              {user?.followers ? user.following : '0'}
            </p>
            <p className='text-sm opacity-80'>Following</p>
          </div>
        </div>

        {userData?.location && (
          <div className='flex items-center gap-1'>
            <div className='flex items-center gap-1'>
              <Icon name='RiMapPinUser' size={16} className='opacity-80' />

              <p className='text-sm opacity-80'>{userData?.location}</p>
            </div>
          </div>
        )}
      </div>

      <div className='mt-4 p-4 pt-0 flex items-center gap-2'>
        {userData?.username !== session?.user.username &&
          status === 'authenticated' && (
            <FollowButtonSecondary
              username={userData?.username}
              className='flex-1 !rounded-md'
            />
          )}

        <Button variant='secondary' size='sm' className='flex-1' asChild>
          <Link href={`/${userData?.username}`}>
            Visit Profile{' '}
            <Icon name='RiArrowRightUp' size={18} className='ml-1' />
          </Link>
        </Button>
      </div>
    </div>
  );
};
