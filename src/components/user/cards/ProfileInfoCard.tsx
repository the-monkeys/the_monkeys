import Icon from '@/components/icon';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { ProfileInfoCardSkeleton } from '@/components/skeletons/profileSkeleton';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import { useSession } from '@/lib/store/useSession';
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
        'border-1 border-foreground-light/50 dark:border-foreground-dark/50 shadow-md rounded-lg overflow-hidden'
      )}
    >
      <div className='mb-[20px] px-4 pt-8 pb-2 w-full flex items-end gap-3 bg-foreground-light/50 dark:bg-foreground-dark/50'>
        <ProfileFrame className='-mb-[20px] size-[85px] !ring-2'>
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

      <div className='mt-[20px] px-4'>
        <div className='mb-2 flex items-center gap-3'>
          <p>
            {user?.followers ? user.followers : '-'}{' '}
            <span className='text-sm opacity-80'>Followers</span>
          </p>

          <p>
            {user?.followers ? user.following : '-'}{' '}
            <span className='text-sm opacity-80'>Following</span>
          </p>
        </div>

        {userData?.bio && (
          <p className='py-2 text-sm leading-tight break-words'>
            {userData.bio}
          </p>
        )}

        {userData?.location && (
          <div className='flex items-center gap-1'>
            <div className='flex items-center gap-1'>
              <Icon name='RiMapPinUser' size={16} className='opacity-80' />

              <p className='text-sm opacity-80'>{userData?.location}</p>
            </div>
          </div>
        )}
      </div>

      <div className='mt-4 p-4 pt-0 flex flex-col items-center gap-3'>
        <LinksRedirectArrow link={`/${userData?.username}`}>
          <p className='font-dm_sans text-sm'>
            Visit{' '}
            <span className='font-medium text-brand-orange'>{`${userData?.first_name}`}</span>
            &apos;s profile
          </p>
        </LinksRedirectArrow>

        {userData?.username !== session?.user.username &&
          status === 'authenticated' && (
            <FollowButtonSecondary
              username={userData?.username}
              className='w-full !rounded-md'
            />
          )}
      </div>
    </div>
  );
};
