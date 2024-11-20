import React from 'react';

import Image from 'next/image';

import useProfileImage from '@/hooks/useProfileImage';
import { twMerge } from 'tailwind-merge';

import { Skeleton } from './ui/skeleton';

export const ProfileFrame = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={twMerge(
        className,
        'ring-1 ring-secondary-lightGrey/25 flex items-center justify-center overflow-hidden rounded-full'
      )}
    >
      {children}
    </div>
  );
};

export const ProfileImage = ({
  firstName,
  username,
}: {
  firstName: string;
  username: string;
}) => {
  const { imageUrl, isLoading, isError } = useProfileImage(username);

  if (isLoading) return <Skeleton className='size-32' />;

  if (isError)
    return (
      <p className='font-jost text-3xl text-primary-monkeyBlack dark:text-primary-monkeyWhite'>
        {firstName.slice(0, 2)}
      </p>
    );

  return (
    <Image
      src={imageUrl}
      alt={`Profile Photo: ${username}`}
      title={`Profile Photo: ${username}`}
      width={32}
      height={32}
      className='w-full h-full object-cover'
    />
  );
};

export default ProfileImage;
