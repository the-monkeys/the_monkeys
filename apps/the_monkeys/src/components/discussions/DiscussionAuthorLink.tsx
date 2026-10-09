'use client';

import Link from 'next/link';

import { AuthorName } from '@/components/user/AuthorName';
import useUser from '@/hooks/user/useUser';

export function DiscussionAuthorLink({ handle }: { handle: string }) {
  const { user } = useUser(handle);
  const firstName = user?.first_name?.trim();
  const lastName = user?.last_name?.trim();
  const hasName = Boolean(firstName || lastName);

  return (
    <>
      <Link
        className='group/author relative z-10 inline-flex min-w-0 text-sm font-semibold'
        href={`/${handle}`}
      >
        <AuthorName
          firstName={hasName ? firstName : `@${handle}`}
          isVerified={user?.is_verified}
          lastName={hasName ? lastName : undefined}
        />
      </Link>
      {hasName ? (
        <span className='min-w-0 shrink-[2] truncate text-xs text-gray-500'>
          @{handle}
        </span>
      ) : null}
    </>
  );
}
