import Link from 'next/link';

import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { BlogUserInfoSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetProfileInfoById from '@/hooks/useGetProfileInfoByUserId';
import moment from 'moment';

export const BlogUserInfo = ({
  user_id,
  date,
}: {
  user_id: string;
  date: number;
}) => {
  const { user, isLoading, isError } = useGetProfileInfoById(user_id);

  if (isLoading) return <BlogUserInfoSkeleton />;

  if (isError) {
    return (
      <p className='mb-4 font-jost text-sm text-alert-red'>
        User info not available
      </p>
    );
  }

  return (
    <div className='mb-4 flex items-center gap-1'>
      {user && (
        <ProfileFrame className='mr-1 size-6'>
          <ProfileImage firstName={user.first_name} username={user?.username} />
        </ProfileFrame>
      )}

      <Link
        href={`/${user?.username}`}
        className='font-jost text-xs sm:text-sm hover:underline'
      >
        {user?.first_name} {user?.last_name}
      </Link>

      <p className='font-jost text-xs sm:text-sm'>
        <span className='opacity-75'>on</span>{' '}
        {moment(date).format('MMM DD, YYYY')}
      </p>
    </div>
  );
};
