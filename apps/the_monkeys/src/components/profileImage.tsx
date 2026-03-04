import React from 'react';

import Image from 'next/image';

import { SmartImage } from '@/components/common/SmartImage';
import useProfileImage from '@/hooks/profile/useProfileImage';
import { decodeBlurHashToDataURL } from '@/utils/blurhash';
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
  firstName,
  lastName,
}: {
  username?: string;
  initials?: string;
  firstName?: string;
  lastName?: string;
}) => {
  const { imageUrl, blurHash, isLoading, isError } = useProfileImage(username);
  const [imgLoadError, setImgLoadError] = React.useState(false);
  const [isImgLoading, setIsImgLoading] = React.useState(true);

  // Reset error when url changes
  React.useEffect(() => {
    setImgLoadError(false);
    setIsImgLoading(true);
  }, [imageUrl]);

  // Helper to generate initials if not provided
  const getInitials = () => {
    if (initials) return initials.toUpperCase().slice(0, 2);
    if (firstName || lastName) {
      const first = firstName?.[0] || '';
      const last = lastName?.[0] || '';
      return (first + last).toUpperCase();
    }
    if (username) return username.slice(0, 2).toUpperCase();
    return '??';
  };

  const blurDataURL = decodeBlurHashToDataURL(blurHash);

  if (isLoading || isError || !imageUrl || imgLoadError)
    return (
      <div className='w-full h-full flex items-center justify-center bg-brand-orange text-white font-bold text-xs sm:text-sm select-none border border-black/5 dark:border-white/5'>
        {getInitials()}
      </div>
    );

  return (
    <SmartImage
      src={imageUrl}
      alt={`Author: ${username}`}
      title={`Author: ${username}`}
      width={50}
      height={50}
      blurHash={blurHash}
      containerClassName='w-full h-full'
      quality={100}
      onError={() => setImgLoadError(true)}
    />
  );
};

export default ProfileImage;
