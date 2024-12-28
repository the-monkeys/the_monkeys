import { Skeleton } from '../ui/skeleton';

export const UserInfoCardSkeleton = () => {
  return (
    <div className='flex items-center gap-2'>
      <Skeleton className='size-10 rounded-full' />

      <div className='space-y-1'>
        <Skeleton className='h-4 w-32' />

        <Skeleton className='h-3 w-36' />
      </div>
    </div>
  );
};

export const UserInfoCardCompactSkeleton = () => {
  return (
    <div className='flex items-center gap-2'>
      <Skeleton className='size-6 rounded-full' />

      <Skeleton className='h-4 w-32' />
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
