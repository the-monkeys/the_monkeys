import { UserInfoCardSkeleton } from './userSkeleton';

export const SearchResultSkeleton = () => {
  return (
    <div className='space-y-2'>
      <UserInfoCardSkeleton />
      <UserInfoCardSkeleton />
      <UserInfoCardSkeleton />
    </div>
  );
};
