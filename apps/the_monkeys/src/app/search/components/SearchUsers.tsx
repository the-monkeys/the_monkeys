'use client';

import Link from 'next/link';

import {
  PaginationNextButton,
  PaginationPrevButton,
} from '@/components/buttons/paginationButton';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { UserRecommendationCardSkeleton } from '@/components/skeletons/userSkeleton';
import { SEARCH_USERS_PER_PAGE } from '@/constants/posts';
import { useSearchPeopleV2 } from '@/hooks/search/useSearchV2';
import { usePagination } from '@/hooks/user/usePagination';
import { SearchUserV2 } from '@/services/search/searchTypes';

const SearchUserCard = ({ user }: { user: SearchUserV2 }) => {
  const displayName = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <div className='p-2 flex gap-3 items-start overflow-hidden'>
      <ProfileFrame className='shrink-0 size-10'>
        <ProfileImage username={user?.username} />
      </ProfileFrame>

      <div className='min-w-0 space-y-0.5'>
        <Link
          href={`/${user.username}`}
          className='block w-fit capitalize hover:underline truncate'
        >
          {displayName || user.username}
        </Link>

        <p className='text-sm opacity-90 truncate'>@{user?.username}</p>

        {user.bio && (
          <p className='text-sm opacity-80 line-clamp-2'>{user.bio}</p>
        )}
      </div>
    </div>
  );
};

export const SearchUsers = ({ query }: { query: string }) => {
  // People search v2 supports offset pagination directly (server caps
  // limit at 50, total isn't returned but we can infer hasNextPage by
  // checking whether the page came back full). usePagination drives the
  // URL-synced ?authorPage= param.
  const { page, next, prev } = usePagination({ paramName: 'authorPage' });
  const offset = page * SEARCH_USERS_PER_PAGE;

  const { users, isLoading, isError } = useSearchPeopleV2({
    query,
    limit: SEARCH_USERS_PER_PAGE,
    offset,
  });

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <UserRecommendationCardSkeleton />
        <UserRecommendationCardSkeleton />
        <UserRecommendationCardSkeleton />
        <UserRecommendationCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-2 flex items-center justify-center'>
        <p className='opacity-90'>Failed to load search results.</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <p className='py-2 text-sm opacity-90 text-center'>
        {page > 0
          ? 'No more authors found.'
          : 'No authors found for your search'}
      </p>
    );
  }

  // `total` isn't part of the v2 people response (the server avoids the
  // extra count(*) round-trip). We infer hasNextPage from page fullness.
  const hasNextPage = users.length >= SEARCH_USERS_PER_PAGE;
  const hasPrevPage = page > 0;

  return (
    <div className='flex flex-col gap-2'>
      {users.map((user) => (
        <SearchUserCard user={user} key={user.username} />
      ))}

      {(hasPrevPage || hasNextPage) && (
        <div className='flex justify-start gap-[10px] mt-4'>
          {hasPrevPage && (
            <PaginationPrevButton onClick={prev} disable={!hasPrevPage} />
          )}
          {hasNextPage && (
            <PaginationNextButton onClick={next} disable={!hasNextPage} />
          )}
        </div>
      )}
    </div>
  );
};
