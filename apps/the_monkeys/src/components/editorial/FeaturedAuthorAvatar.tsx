'use client';

import Link from 'next/link';

import useProfileImage from '@/hooks/profile/useProfileImage';

/**
 * Single featured-author tile that renders ONLY when the user has a real
 * profile picture uploaded. We probe `/storage/profiles/<username>/profile`
 * via `useProfileImage`; if it 404s the tile collapses (returns null) so
 * the strip stays curated rather than padded with default avatars.
 *
 * Designed for direct username consumption (no userId → profile round
 * trip) so it composes cleanly with the `/api/v2/user/active-users`
 * response which only carries usernames.
 */
export interface FeaturedAuthorAvatarProps {
  username: string;
  firstName?: string;
  /** Override the default route. Defaults to `/{username}`. */
  href?: string;
}

export const FeaturedAuthorAvatar = ({
  username,
  firstName,
  href,
}: FeaturedAuthorAvatarProps) => {
  const { imageUrl, isLoading, isError } = useProfileImage(username);

  // Hide the tile entirely when the user has no real picture — keeps the
  // strip visually consistent (every avatar is a real photo/logo).
  if (!isLoading && (isError || !imageUrl)) {
    return null;
  }

  return (
    <Link
      href={href ?? `/${username}`}
      className='flex flex-col items-center gap-2 shrink-0'
    >
      <div className='flex h-20 w-20 items-center justify-center rounded-full border-2 p-1 border-brand-orange'>
        <div className='relative h-full w-full overflow-hidden rounded-full bg-foreground-light/10 dark:bg-foreground-dark/10'>
          {isLoading || !imageUrl ? (
            // Plain skeleton while the image loads — avoids the
            // default-profile flash that would suggest "real user
            // without picture".
            <div className='h-full w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full' />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={firstName ?? username}
              title={firstName ?? username}
              className='h-full w-full object-cover rounded-full'
              loading='lazy'
            />
          )}
        </div>
      </div>
      <p className='max-w-24 truncate text-center text-xs font-semibold text-gray-900 dark:text-gray-100'>
        {firstName ?? username}
      </p>
    </Link>
  );
};

export default FeaturedAuthorAvatar;
