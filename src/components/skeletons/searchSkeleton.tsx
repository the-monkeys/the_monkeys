import { UserInfoCardSkeleton } from './userSkeleton';

export const SearchResultSkeleton = () => {
  return (
    <div className='space-y-2'>
      {new Array(3).fill(null).map((_, index) => {
        return <UserInfoCardSkeleton key={index} />;
      })}
    </div>
  );
};
