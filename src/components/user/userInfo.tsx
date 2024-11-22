import Link from 'next/link';

import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';

import ProfileImage, { ProfileFrame } from '../profileImage';
import {
  UserInfoCardCompactSkeleton,
  UserInfoCardSkeleton,
} from '../skeletons/blogSkeleton';
import { FollowButtonCompact } from './buttons/followButton';

export const UserInfoCardCompact = ({
  id,
  prefixContent,
}: {
  id?: string;
  prefixContent?: string;
}) => {
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
        <ProfileFrame className='mr-1 size-4 md:size-6'>
          <ProfileImage firstName={user.first_name} username={user?.username} />
        </ProfileFrame>
      )}

      <p className='font-josefin_Sans text-xs sm:text-sm'>
        <span className='font-light opacity-75'>{prefixContent} </span>

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
        <ProfileFrame className='size-10 md:size-12'>
          <ProfileImage firstName={user.first_name} username={user?.username} />
        </ProfileFrame>
      )}

      <div className='flex-1 flex flex-col items-start'>
        <Link
          href={`/${user?.username}`}
          className='w-fit font-josefin_Sans font-medium text-sm md:text-base hover:underline underline-offset-2 decoration-1'
        >
          {user?.first_name} {user?.last_name}
        </Link>

        <FollowButtonCompact username={user?.username} />
      </div>
    </div>
  );
};
