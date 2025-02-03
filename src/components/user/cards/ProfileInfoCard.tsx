import Link from 'next/link';

import { useSession } from '@/app/session-store-provider';
import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { ProfileInfoCardSkeleton } from '@/components/skeletons/profileSkeleton';
import { Button } from '@/components/ui/button';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import { twMerge } from 'tailwind-merge';

import { FollowButton } from '../buttons/followButton';

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
        'border-1 border-foreground-light/50 dark:border-foreground-dark/50 rounded-md overflow-hidden'
      )}
    >
      <div className='mb-[20px] p-2 w-full bg-foreground-light/25 dark:bg-foreground-dark/25 space-y-2'>
        <div className='flex items-center justify-end gap-[6px]'>
          {userData?.username !== session?.user.username &&
            status === 'authenticated' && (
              <FollowButton
                username={userData?.username}
                className='!rounded-md'
              />
            )}

          <Button variant='secondary' size='icon' asChild>
            <Link href={`/${userData?.username}`}>
              <Icon name='RiArrowRightUp' />
            </Link>
          </Button>
        </div>

        <div className='flex items-end gap-3'>
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
      </div>

      <div className='mt-[20px] px-4 pb-4 space-y-1'>
        {userData?.bio && (
          <p className='py-1 leading-tight break-words'>{userData.bio}</p>
        )}

        <div className='flex items-center gap-2'>
          <p className='font-medium'>
            {user?.followers ? user.followers : '0'}{' '}
            <span className='font-normal opacity-80'>Followers</span>
          </p>

          <p className='font-medium'>
            {user?.following ? user.following : '0'}{' '}
            <span className='font-normal opacity-80'>Followers</span>
          </p>
        </div>
      </div>
    </div>
  );
};
