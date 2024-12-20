import Link from 'next/link';

import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { ProfileInfoCardSkeleton } from '@/components/skeletons/profileSkeleton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import useUser from '@/hooks/user/useUser';
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
  const {
    user: userInfo,
    isLoading: infoLoading,
    isError: infoError,
  } = useGetProfileInfoById(userId);
  const {
    user: userDetails,
    isLoading: detailsLoading,
    isError: detailsError,
  } = useUser(userInfo?.username);

  if (infoLoading || detailsLoading) return <ProfileInfoCardSkeleton />;

  const joinedDate = userDetails?.created_at
    ? moment.unix(userDetails?.created_at.seconds).format('MMM, YYYY')
    : 'Not available';

  return (
    <div
      className={twMerge(
        className,
        'p-4 bg-foreground-light/25 dark:bg-foreground-dark/25 rounded-xl'
      )}
    >
      <div className='mb-2 flex items-end gap-1'>
        {userInfo && (
          <ProfileFrame className='size-16 sm:size-20'>
            <ProfileImage
              firstName={userInfo.first_name}
              username={userInfo?.username}
            />
          </ProfileFrame>
        )}

        <Button variant='outline' size='sm' className='rounded-full' asChild>
          <Link href={`/${userInfo?.username}`}>
            Visit <Icon name='RiArrowRightUp' size={16} className='ml-1' />
          </Link>
        </Button>

        <FollowButtonSecondary username={userInfo?.username} />
      </div>

      <h2 className='pt-1 w-full font-dm_sans font-medium text-xl md:text-2xl capitalize'>
        {`${userInfo?.first_name} ${userInfo?.last_name}`}
      </h2>

      {userDetails?.bio && (
        <p className='text-sm md:text-base font-roboto leading-tight break-words opacity-80'>
          {userDetails.bio}
        </p>
      )}

      <div className='mt-2 flex gap-3'>
        <div className='flex items-center gap-1'>
          <Icon name='RiCalendar' size={18} className='opacity-80' />

          <p className='font-roboto text-sm opacity-80'>Joined {joinedDate}</p>
        </div>

        {userDetails?.address && (
          <div className='flex items-center gap-1'>
            <div className='flex items-center gap-1'>
              <Icon name='RiMapPin' size={18} className='opacity-80' />

              <p className='font-roboto text-sm opacity-80'>
                {userDetails.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
