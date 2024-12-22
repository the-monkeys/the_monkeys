import Link from 'next/link';

import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { ProfileInfoCardSkeleton } from '@/components/skeletons/profileSkeleton';
import { Button } from '@/components/ui/button';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import moment from 'moment';
import { twMerge } from 'tailwind-merge';

import { FollowButtonSecondary } from '../buttons/followButton';

export const ProfileInfoCard = ({
  userId,
  className,
}: {
  userId?: string;
  className?: string;
}) => {
  const { user, isLoading, isError } = useGetProfileInfoById(userId);

  if (isLoading) return <ProfileInfoCardSkeleton />;

  const userData = user?.user;

  const joinedDate = userData?.created_at
    ? moment.unix(userData?.created_at.seconds).format('MMM, YYYY')
    : 'NA';

  return (
    <div
      className={twMerge(
        className,
        'p-4 bg-foreground-light/25 dark:bg-foreground-dark/25 border-1 border-border-light/25 dark:border-border-dark/25 rounded-xl'
      )}
    >
      <div className='mb-2 flex items-end gap-2'>
        {userData && (
          <ProfileFrame className='size-16 sm:size-20'>
            <ProfileImage
              firstName={userData.first_name}
              username={userData?.username}
            />
          </ProfileFrame>
        )}

        <div className='flex-1 overflow-hidden'>
          <p className='font-dm_sans text-xs sm:text-sm opacity-80 truncate'>
            {`@${userData?.username}`}
          </p>

          <h2 className='w-full font-dm_sans font-medium text-xl md:text-2xl capitalize'>
            {`${userData?.first_name} ${userData?.last_name}`}
          </h2>
        </div>
      </div>

      {userData?.bio && (
        <p className='py-2 text-base leading-tight break-words'>
          {userData.bio}
        </p>
      )}

      <div className='flex items-center flex-wrap gap-x-2'>
        <p>
          {user?.followers ? user.followers : '-'}{' '}
          <span className='text-sm opacity-80'>Followers</span>
        </p>

        <p>
          {user?.followers ? user.following : '-'}{' '}
          <span className='text-sm opacity-80'>Following</span>
        </p>
      </div>

      <div className='flex gap-x-3 gap-y-1 flex-wrap'>
        {userData?.created_at && (
          <div className='flex items-center gap-1'>
            <Icon name='RiCalendar' size={18} className='opacity-80' />

            <p className='font-roboto text-sm opacity-80'>
              Joined {joinedDate}
            </p>
          </div>
        )}

        {userData?.address && (
          <div className='flex items-center gap-1'>
            <div className='flex items-center gap-1'>
              <Icon name='RiMapPin' size={18} className='opacity-80' />

              <p className='font-roboto text-sm opacity-80'>
                {userData.address}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className='mt-4 flex gap-2'>
        <Button variant='secondary' asChild>
          <Link href={`/${userData?.username}`}>View Profile</Link>
        </Button>

        <FollowButtonSecondary username={userData?.username} />
      </div>
    </div>
  );
};
