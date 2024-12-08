import { Skeleton } from '../ui/skeleton';

export const SearchResultSkeleton = () => {
  return (
    <div className='space-y-2'>
      <Skeleton className='h-8 w-full rounded-none' />
      <Skeleton className='h-8 w-full rounded-none' />
      <Skeleton className='h-8 w-full rounded-none' />
    </div>
  );
};
