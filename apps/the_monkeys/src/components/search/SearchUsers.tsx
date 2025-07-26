import Link from 'next/link';

import { useGetSearchUser } from '@/hooks/user/useGetSearchUser';

import ProfileImage, { ProfileFrame } from '../profileImage';
import { SearchResultSkeleton } from '../skeletons/searchSkeleton';

export const SearchUsers = ({ query }: { query: string }) => {
  const { searchUsers, searchUsersLoading, searchUsersError } =
    useGetSearchUser(query.trim() ? query : undefined);

  if (searchUsersLoading) {
    return <SearchResultSkeleton />;
  }

  if (searchUsersError) {
    return (
      <p className='text-sm opacity-80 text-center'>
        Failed to load search results.
      </p>
    );
  }

  const users = searchUsers?.users;

  return (
    <div className='p-4 space-y-3'>
      <h4 className='font-dm_sans font-medium text-sm opacity-80'>Profiles</h4>

      {!users || users === null ? (
        <p className='text-sm opacity-80 text-center'>No matching profiles.</p>
      ) : (
        <div className='flex flex-col gap-2'>
          {users.slice(0, 5).map((user) => {
            return (
              <Link
                href={`/${user.username}`}
                className='group flex gap-2 items-center'
                key={user.username}
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
          })}
        </div>
      )}
    </div>
  );
};
