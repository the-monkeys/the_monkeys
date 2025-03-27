import { UserInfoCardSkeleton } from './userSkeleton';

export const SearchResultSkeleton = () => {
  return (
    <div className='p-4 space-y-2'>
      <UserInfoCardSkeleton />
      <UserInfoCardSkeleton />
      <UserInfoCardSkeleton />
      <UserInfoCardSkeleton />
    </div>
  );
};
