import { Skeleton } from '../ui/skeleton';

export const UserInfoCardSkeleton = () => {
  return (
    <div className='flex items-center flex-wrap gap-2'>
      <Skeleton className='size-12 rounded-full' />

      <div className='flex-1 space-y-1'>
        <Skeleton className='w-28 sm:w-44 h-6' />
        <Skeleton className='w-24 sm:w-40 h-3' />
      </div>
    </div>
  );
};

export const UserInfoCardCompactSkeleton = () => {
  return (
    <div className='flex items-center gap-2'>
      <Skeleton className='size-6 rounded-full' />

      <Skeleton className='h-4 w-28' />
    </div>
  );
};

export const ConnectionsListSkeleton = () => {
  return (
    <div className='space-y-2'>
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-10 w-full' />
    </div>
  );
};
