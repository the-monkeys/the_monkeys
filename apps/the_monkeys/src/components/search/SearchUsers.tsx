import Link from 'next/link';

import { useSearchPeopleV2 } from '@/hooks/search/useSearchV2';
import { SearchUserV2 } from '@/services/search/searchTypes';

import ProfileImage, { ProfileFrame } from '../profileImage';
import { SearchResultsAuthorSkeleton } from '../skeletons/searchSkeleton';

// Card for a single person in the search dropdown. Kept colocated with
// the list component since this shape is only used here.
const SearchUserCard = ({
  user,
  onClose,
}: {
  user: SearchUserV2;
  onClose?: () => void;
}) => {
  const displayName = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <div className='p-1 flex gap-2 items-center overflow-hidden'>
      <ProfileFrame className='shrink-0 size-9'>
        <ProfileImage username={user?.username} />
      </ProfileFrame>

      <div className='min-w-0'>
        <Link
          target='_blank'
          href={`/${user.username}`}
          className='block w-fit capitalize hover:underline truncate'
          onClick={onClose}
        >
          {displayName || user.username}
        </Link>

        <p className='text-sm opacity-90 truncate'>@{user?.username}</p>
      </div>
    </div>
  );
};

export const SearchUsers = ({
  query,
  onClose,
  limit = 5,
}: {
  query: string;
  onClose?: () => void;
  limit?: number;
}) => {
  // Search-v2: ranked, active-only, server-paginated. The dropdown
  // requests `limit` items directly so we don't need a client-side
  // slice (the v1 hook returned up to 10 and we threw half away).
  const { users, isLoading, isError } = useSearchPeopleV2({
    query,
    limit,
  });

  if (isLoading) {
    return <SearchResultsAuthorSkeleton />;
  }

  if (isError) {
    return (
      <p className='text-sm opacity-90 text-center'>
        Failed to load search results.
      </p>
    );
  }

  if (!users || users.length === 0) {
    return (
      <p className='text-sm opacity-80 text-center'>
        No authors found for your search
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      {users.map((user) => (
        <SearchUserCard user={user} onClose={onClose} key={user.username} />
      ))}
    </div>
  );
};
