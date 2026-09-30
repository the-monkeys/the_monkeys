'use client';

import Link from 'next/link';

import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';

import ProfileImage from '../../../../components/profileImage';

export interface TeamMember {
  userId: string;
}

export function FeaturedAuthorStory({ userId }: TeamMember) {
  const { user, isLoading, isError } = useGetProfileInfoById(userId);
  const userData = user?.user;

  return (
    <Link
      href={`/${userData?.username}`}
      key={userData?.username}
      className='flex flex-col items-center gap-2'
    >
      <div className='flex h-20 w-20 items-center justify-center rounded-full  border-2 p-1 border-brand-orange'>
        {/* Profile Image */}
        <div className='relative h-full w-full overflow-hidden '>
          <ProfileImage username={userData?.username} />
        </div>
      </div>
      {/* Name */}
      <p className='max-w-24 text-center text-xs font-semibold text-gray-900 dark:text-gray-100'>
        {userData?.first_name}
      </p>
    </Link>
  );
}
