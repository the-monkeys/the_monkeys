'use client';

import Link from 'next/link';

import { AuthorName } from '@/components/user/AuthorName';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import useUser from '@/hooks/user/useUser';
import { twMerge } from 'tailwind-merge';

function isInternalAccountUsername(username?: string) {
  return !!username && /^[a-f0-9]{32}$/i.test(username.trim());
}

export function EventHostName({
  username,
  accountId,
  prefix,
  size = 14,
  className,
}: {
  username?: string;
  accountId?: string;
  prefix?: string;
  size?: number;
  className?: string;
}) {
  const publicUsername = isInternalAccountUsername(username)
    ? undefined
    : username?.trim() || undefined;

  const { user: byUsername } = useUser(publicUsername);
  const { user: byAccount } = useGetProfileInfoById(
    publicUsername ? undefined : accountId
  );

  const firstName = byUsername?.first_name || byAccount?.user?.first_name;
  const lastName = byUsername?.last_name || byAccount?.user?.last_name;
  const isVerified = byUsername?.is_verified ?? byAccount?.user?.is_verified;
  const hrefUsername = publicUsername || byAccount?.user?.username;
  const displayName = [firstName, lastName].filter(Boolean).join(' ');
  const fallback = publicUsername ? `@${publicUsername}` : undefined;
  const label = displayName || fallback;

  if (!label || !hrefUsername) return null;

  return (
    <Link
      href={`/${hrefUsername}`}
      className={twMerge(
        'group/author inline-flex min-w-0 max-w-full items-center gap-1 hover:text-brand-orange',
        className
      )}
    >
      {prefix ? <span className='shrink-0'>{prefix}</span> : null}
      {displayName ? (
        <AuthorName
          firstName={firstName}
          lastName={lastName}
          isVerified={isVerified}
          size={size}
        />
      ) : (
        <span className='min-w-0 truncate'>{fallback}</span>
      )}
    </Link>
  );
}
