import React from 'react';

import Image from 'next/image';

import useProfileImage from '@/hooks/profile/useProfileImage';
import { twMerge } from 'tailwind-merge';

import Icon from './icon';
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
        'bg-background-light dark:bg-background-dark ring-1 ring-border-light/25 dark:ring-border-dark/25 flex items-center justify-center overflow-hidden rounded-full'
      )}
    >
      {children}
    </div>
  );
};

export const ProfileImage = ({ username }: { username?: string }) => {
  const { imageUrl, isLoading, isError } = useProfileImage(username);

  if (isLoading) return <Skeleton className='size-32' />;

  if (isError)
    return (
      <Image
        src='/default-profile.svg'
        alt={`Profile: ${username}`}
        title={`Profile: ${username}`}
        width={32}
        height={32}
        className='w-full h-full object-cover'
      />
    );

  return (
    <Image
      src={imageUrl}
      alt={`Profile: ${username}`}
      title={`Profile: ${username}`}
      width={32}
      height={32}
      className='w-full h-full object-cover'
    />
  );
};

export default ProfileImage;
