import React from 'react';

import Image from 'next/image';

import useProfileImage from '@/hooks/useUserProfile';

import { Skeleton } from './ui/skeleton';

export const ProfileImage = ({ username }: { username: string }) => {
  const { imageUrl, isLoading, isError } = useProfileImage(username);

  if (isLoading) return <Skeleton className='size-32' />;

  if (isError) return <p className='font-jost text-sm'>Not Available</p>;

  return (
    <Image
      src={imageUrl}
      alt={`Profile Image: ${username}`}
      width={32}
      height={32}
      className='w-full h-full'
    />
  );
};

export default ProfileImage;
