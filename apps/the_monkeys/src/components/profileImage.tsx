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
      unoptimized
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

export const ProfileImage = ({
  username,
  initials,
}: {
  username?: string;
  initials?: string;
}) => {
  const { imageUrl, isLoading, isError } = useProfileImage(username);
  const [imgLoadError, setImgLoadError] = React.useState(false);

  // Reset error when url changes
  React.useEffect(() => {
    setImgLoadError(false);
  }, [imageUrl]);

  // Helper to generate initials if not provided
  const getInitials = () => {
    if (initials) return initials.toUpperCase().slice(0, 2);
    if (username) return username.slice(0, 2).toUpperCase();
    return '??';
  };

  if (isLoading || isError || !imageUrl || imgLoadError)
    return (
      <div className='w-full h-full flex items-center justify-center bg-brand-orange text-white font-bold text-xs sm:text-sm select-none border border-black/5 dark:border-white/5'>
        {getInitials()}
      </div>
    );

  return (
    <Image
      src={imageUrl}
      alt={`Author: ${username}`}
      title={`Author: ${username}`}
      width={50}
      height={50}
      className='w-full h-full object-cover'
      loading='lazy'
      quality={100}
      onError={() => setImgLoadError(true)}
    />
  );
};

export default ProfileImage;
