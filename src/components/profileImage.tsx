import React from 'react';

import Image from 'next/image';

import useProfileImage from '@/hooks/profile/useProfileImage';
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
        'bg-foreground-light dark:bg-foreground-dark border-1 border-border-light dark:border-border-dark flex items-center justify-center overflow-hidden rounded-full'
      )}
    >
      {children}
    </div>
  );
};

export const ProfileImage = ({ username }: { username?: string }) => {
  const { imageUrl, isLoading, isError } = useProfileImage(username);

  if (isLoading) return <Skeleton className='size-32' />;

  if (isError) return null;

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
