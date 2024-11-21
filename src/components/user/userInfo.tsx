import Link from 'next/link';

import useGetProfileInfoById from '@/hooks/useGetProfileInfoByUserId';

import ProfileImage, { ProfileFrame } from '../profileImage';
import {
  UserInfoCardCompactSkeleton,
  UserInfoCardSkeleton,
} from '../skeletons/blogSkeleton';

export const UserInfoCardCompact = ({ id }: { id?: string }) => {
  const { user, isLoading, isError } = useGetProfileInfoById(id);

  if (isLoading) return <UserInfoCardCompactSkeleton />;

  if (isError) {
    return (
      <p className='mb-4 font-jost text-sm text-alert-red'>
        User info not available
      </p>
    );
  }

  return (
    <div className='w-fit flex items-center gap-1'>
      {user && (
        <ProfileFrame className='mr-1 size-6'>
          <ProfileImage firstName={user.first_name} username={user?.username} />
        </ProfileFrame>
      )}

      <p className='font-jost text-xs sm:text-sm'>
        <span className='font-light opacity-75'>Authored by </span>

        <Link
          href={`/${user?.username}`}
          className='hover:underline underline-offset-2 decoration-1'
        >
          {user?.first_name} {user?.last_name}
        </Link>
      </p>
    </div>
  );
};

export const UserInfoCard = ({ id }: { id?: string }) => {
  const { user, isLoading, isError } = useGetProfileInfoById(id);

  if (isLoading) {
    return <UserInfoCardSkeleton />;
  }

  if (isError)
    return (
      <p className='py-4 font-jost text-sm text-alert-red'>
        User not available
      </p>
    );

  return (
    <div className='flex items-center flex-wrap gap-2'>
      {user && (
        <ProfileFrame className='size-12'>
          <ProfileImage firstName={user.first_name} username={user?.username} />
        </ProfileFrame>
      )}

      <div className='flex-1 flex items-center gap-x-1 flex-wrap'>
        <Link
          href={`/${user?.username}`}
          className='font-josefin_Sans text-base md:text-lg hover:underline underline-offset-2 decoration-1'
        >
          {user?.first_name} {user?.last_name}
        </Link>

        <p className='w-full font-jost text-xs md:text-sm opacity-75'>
          {`@${user?.username}`}
        </p>
      </div>
    </div>
  );
};
