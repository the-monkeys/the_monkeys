import { Skeleton } from '../ui/skeleton';

export const TopHeadlinesSkeleton = () => {
  return (
    <div className='mt-2 space-y-2'>
      <Skeleton className='h-20 rounded-none' />

      <Skeleton className='h-20 rounded-none' />

      <Skeleton className='h-20 rounded-none' />

      <Skeleton className='h-20 rounded-none' />

      <Skeleton className='h-20 rounded-none' />
    </div>
  );
};
