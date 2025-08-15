import React from 'react';

import Image from 'next/image';

import useProfileImage from '@/hooks/profile/useProfileImage';
import { twMerge } from 'tailwind-merge';

export const DefaultProfile = () => {
  return (
    <Image
      src='/default-profile.svg'
      alt='User not found'
      height={100}
      width={100}
      className='w-full h-full object-cover'
    />
  );
};

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
        'flex items-center justify-center bg-foreground-light/25 dark:bg-foreground-dark/25 overflow-hidden rounded-full'
      )}
    >
      {children}
    </div>
  );
};

export const ProfileImage = ({ username }: { username?: string }) => {
  const { imageUrl, isLoading, isError } = useProfileImage(username);

  if (isLoading)
    return (
      <Image
        src='/default-profile.svg'
        alt={`Author: ${username}`}
        title={`Author: ${username}`}
        width={32}
        height={32}
        className='w-full h-full object-cover'
        priority
      />
    );

  if (isError || imageUrl === '')
    return (
      <Image
        src='/default-profile.svg'
        alt={`Author: ${username}`}
        title={`Author: ${username}`}
        width={32}
        height={32}
        className='w-full h-full object-cover'
      />
    );

  return (
    <Image
      src={imageUrl}
      alt={`Author: ${username}`}
      title={`Author: ${username}`}
      width={32}
      height={32}
      className='w-full h-full object-cover'
    />
  );
};

export default ProfileImage;
