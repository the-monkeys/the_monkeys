import Link from 'next/link';

import { useGetSearchUser } from '@/hooks/user/useGetSearchUser';
import { SearchUser } from '@/services/search/searchTypes';

import ProfileImage, { ProfileFrame } from '../profileImage';
import { SearchResultsAuthorSkeleton } from '../skeletons/searchSkeleton';

const SearchUserCard = ({
  user,
  onClose,
}: {
  user: SearchUser;
  onClose?: () => void;
}) => {
  return (
    <div className='p-1 flex gap-2 items-center overflow-hidden'>
      <ProfileFrame className='shrink-0 size-9'>
        <ProfileImage username={user?.username} />
      </ProfileFrame>

      <div>
        <Link
          target='_blank'
          href={`/${user.username}`}
          className='w-fit capitalize hover:underline truncate'
          onClick={onClose}
        >
          {user?.first_name} {user?.last_name ? user?.last_name : ''}
        </Link>

        <p className='text-sm opacity-90 truncate'>@{user?.username}</p>
      </div>
    </div>
  );
};

export const SearchUsers = ({
  query,
  onClose,
}: {
  query: string;
  onClose?: () => void;
}) => {
  // TOOD: Cache the search results using zustand store

  const { searchUsers, searchUsersLoading, searchUsersError } =
    useGetSearchUser(query.trim() ? query : undefined);

  if (searchUsersLoading) {
    return <SearchResultsAuthorSkeleton />;
  }

  if (searchUsersError) {
    return (
      <p className='text-sm opacity-90 text-center'>
        Failed to load search results.
      </p>
    );
  }

  const users = searchUsers?.users;

  return (
    <>
      {!users || users === null ? (
        <p className='text-sm opacity-80 text-center'>
          No results found for your search
        </p>
      ) : (
        <div className='flex flex-col gap-2'>
          {users?.slice(0, 5).map((user) => {
            return (
              <SearchUserCard
                user={user}
                onClose={onClose}
                key={user.username}
              />
            );
          })}
        </div>
      )}
    </>
  );
};
