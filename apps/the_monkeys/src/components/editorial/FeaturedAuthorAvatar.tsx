'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import useProfileImage from '@/hooks/profile/useProfileImage';
import { queryKeys } from '@/lib/queryKeys';
import { useQueryClient } from '@tanstack/react-query';

export interface FeaturedAuthorAvatarProps {
  username: string;
  firstName?: string;
  /** Override the default route. Defaults to `/{username}`. */
  href?: string;
  variant?: 'default' | 'compact';
  /** The strip reveals its successfully decoded avatars as one batch. */
  visible?: boolean;
  onAvailabilityChange?: (
    username: string,
    available: boolean | undefined
  ) => void;
}

/** Neutral placeholders keep SSR independent of the browser's Blob cache. */
export const FeaturedAuthorSkeleton = ({
  variant = 'default',
}: Pick<FeaturedAuthorAvatarProps, 'variant'>) => (
  <div
    aria-hidden='true'
    className={`flex shrink-0 flex-col items-center ${
      variant === 'compact' ? 'gap-1.5' : 'gap-2'
    }`}
  >
    <div
      className={`flex items-center justify-center rounded-full border-2 border-brand-orange p-1 ${
        variant === 'compact' ? 'h-12 w-12' : 'h-20 w-20'
      }`}
    >
      <div className='h-full w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-700' />
    </div>
    <p className={`text-xs ${variant === 'compact' ? 'text-[11px]' : ''}`}>
      &nbsp;
    </p>
  </div>
);

/** Uses the shared public Blob cache, but waits for decoding before revealing. */
export const FeaturedAuthorAvatar = ({
  username,
  firstName,
  href,
  variant = 'default',
  visible = true,
  onAvailabilityChange,
}: FeaturedAuthorAvatarProps) => {
  const { imageUrl, isLoading, isError } = useProfileImage(username);
  const queryClient = useQueryClient();
  const [decoded, setDecoded] = useState<{
    url: string;
    available: boolean;
  }>();

  useEffect(() => {
    let cancelled = false;
    let image: HTMLImageElement | undefined;
    const reset = () => {
      cancelled = true;
      if (image) {
        image.onload = null;
        image.onerror = null;
      }
      onAvailabilityChange?.(username, undefined);
    };
    // An empty URL can also mean the shared hook has not created its object
    // URL yet. Only a cached null or an error proves the image is unavailable.
    if (
      isError ||
      queryClient.getQueryData(queryKeys.profile.image(username)) === null
    ) {
      setDecoded({ url: '', available: false });
      onAvailabilityChange?.(username, false);
      return reset;
    }
    if (isLoading || !imageUrl) return reset;
    image = new Image();
    const settle = (available: boolean) => {
      if (cancelled) return;
      setDecoded({ url: imageUrl, available });
      onAvailabilityChange?.(username, available);
    };
    if (typeof image.decode === 'function') {
      image.src = imageUrl;
      void image.decode().then(
        () => settle(true),
        () => settle(false)
      );
    } else {
      // Install handlers before src so even an immediately cached load settles.
      image.onload = () => settle(true);
      image.onerror = () => settle(false);
      image.src = imageUrl;
    }
    return reset;
  }, [
    imageUrl,
    isLoading,
    isError,
    username,
    queryClient,
    onAvailabilityChange,
  ]);

  if (!visible) return null;
  if (decoded?.available === false) return null;
  if (!decoded || decoded.url !== imageUrl)
    return <FeaturedAuthorSkeleton variant={variant} />;

  return (
    <Link
      href={href ?? `/${username}`}
      className={`flex shrink-0 snap-start flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background-dark ${
        variant === 'compact' ? 'gap-1.5' : 'gap-2'
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-full border-2 border-brand-orange p-1 ${
          variant === 'compact' ? 'h-12 w-12' : 'h-20 w-20'
        }`}
      >
        <div className='relative h-full w-full overflow-hidden rounded-full bg-foreground-light/10 dark:bg-foreground-dark/10'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={decoded.url}
            alt={firstName ?? username}
            title={firstName ?? username}
            className='h-full w-full object-cover rounded-full'
            loading='lazy'
          />
        </div>
      </div>
      <p
        title={firstName ?? username}
        className={`truncate text-center text-xs font-semibold text-gray-900 dark:text-gray-100 ${
          variant === 'compact' ? 'max-w-20 text-[11px]' : 'max-w-24'
        }`}
      >
        {firstName ?? username}
      </p>
    </Link>
  );
};

export default FeaturedAuthorAvatar;
