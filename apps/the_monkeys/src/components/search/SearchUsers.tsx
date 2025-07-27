import Link from 'next/link';

import { useGetSearchUser } from '@/hooks/user/useGetSearchUser';
import { SearchUser } from '@/services/search/searchTypes';

import ProfileImage, { ProfileFrame } from '../profileImage';
import { SearchResultsSkeleton } from '../skeletons/searchSkeleton';

const SearchUserCard = ({
  user,
  onClose,
}: {
  user: SearchUser;
  onClose?: () => void;
}) => {
  return (
    <Link
      href={`/${user.username}`}
      className='group flex gap-2 items-center'
      onClick={onClose}
    >
      <ProfileFrame className='size-8'>
        <ProfileImage username={user?.username} />
      </ProfileFrame>

      <div className='flex-1 overflow-hidden'>
        <h4 className='w-full font-dm_sans font-medium text-sm capitalize group-hover:underline'>
          {user?.first_name} {user?.last_name}
        </h4>

        <p className='font-dm_sans text-[13px] opacity-80 truncate'>
          {`@${user.username}`}
        </p>
      </div>
    </Link>
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
    return <SearchResultsSkeleton />;
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
