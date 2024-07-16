import React from 'react';

import Image from 'next/image';

import useProfileImage from '@/hooks/useProfileImage';

import { Skeleton } from './ui/skeleton';

export const ProfileImage = ({ username }: { username: string }) => {
  const { imageUrl, isLoading, isError } = useProfileImage(username);

  if (isLoading) return <Skeleton className='size-32' />;

  if (isError)
    return (
      <p className='font-jost text-sm text-center'>
        Not
        <br />
        Available
      </p>
    );

  return (
    <Image
      src={imageUrl}
      alt={`Profile Photo: ${username}`}
      title={`Profile Photo: ${username}`}
      width={32}
      height={32}
      className='w-full h-full'
    />
  );
};

export default ProfileImage;
