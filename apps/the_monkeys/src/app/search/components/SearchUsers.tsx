import Link from 'next/link';

import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { UserRecommendationCardSkeleton } from '@/components/skeletons/userSkeleton';
import { useGetSearchUser } from '@/hooks/user/useGetSearchUser';
import { SearchUser } from '@/services/search/searchTypes';

const SearchUserCard = ({ user }: { user: SearchUser }) => {
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
        >
          {user?.first_name} {user?.last_name ? user?.last_name : ''}
        </Link>

        <p className='text-sm opacity-90 truncate'>@{user?.username}</p>
      </div>
    </div>
  );
};

export const SearchUsers = ({ query }: { query: string }) => {
  const { searchUsers, searchUsersLoading, searchUsersError } =
    useGetSearchUser(query.trim() ? query : undefined);

  if (searchUsersLoading) {
    return (
      <div className='space-y-4'>
        <UserRecommendationCardSkeleton />
        <UserRecommendationCardSkeleton />
        <UserRecommendationCardSkeleton />
        <UserRecommendationCardSkeleton />
      </div>
    );
  }

  if (searchUsersError) {
    return (
      <div className='p-2 flex items-center justify-center'>
        <p className='opacity-90'>No results found.</p>
      </div>
    );
  }

  const users = searchUsers?.users;

  return (
    <>
      {!users || users === null ? (
        <p className='py-2 text-sm opacity-90 text-center'>
          No authors found for your search
        </p>
      ) : (
        <div className='flex flex-col space-y-6'>
          {users.map((user) => {
            return <SearchUserCard user={user} key={user?.username} />;
          })}
        </div>
      )}
    </>
  );
};
