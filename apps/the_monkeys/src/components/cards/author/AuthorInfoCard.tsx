import Link from 'next/link';

import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { AuthorInfoCardSkeleton } from '@/components/skeletons/profileSkeleton';
import { FollowButton } from '@/components/user/buttons/followButton';
import useAuth from '@/hooks/auth/useAuth';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import { Button } from '@the-monkeys/ui/atoms/button';
import { twMerge } from 'tailwind-merge';

export const AuthorInfoCard = ({
  userId,
  className,
}: {
  userId?: string;
  className?: string;
}) => {
  const { data: session, isSuccess } = useAuth();
  const { user, isLoading, isError } = useGetProfileInfoById(userId);

  if (isLoading) return <AuthorInfoCardSkeleton />;

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
          {userData?.username !== session?.username && isSuccess && (
            <FollowButton username={userData?.username} />
          )}

          <Button
            variant='secondary'
            size='icon'
            className='rounded-full'
            asChild
          >
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
              {userData?.first_name}{' '}
              {userData?.last_name ? userData?.last_name : ''}
            </h2>
          </div>
        </div>
      </div>

      <div className='mt-[20px] px-4 pb-4 space-y-1'>
        {userData?.bio && (
          <p className='py-2 leading-tight break-words'>{userData.bio}</p>
        )}

        <div className='flex items-center gap-2'>
          <p className='font-medium'>
            {user?.followers ? user.followers : '0'}{' '}
            <span className='font-normal opacity-80'>Followers</span>
          </p>

          {userData?.location && (
            <div className='flex items-center gap-1'>
              <Icon name='RiMapPinUser' size={18} type='Fill' />

              <p className='opacity-80'>{userData.location}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
