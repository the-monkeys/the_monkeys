import { Skeleton } from '../ui/skeleton';

export const ProfileCardSkeleton = () => {
  return (
    <div className='space-y-3'>
      <div className='flex flex-wrap items-end gap-2'>
        <Skeleton className='size-32' />

        <div className='space-y-2'>
          <Skeleton className='h-6 w-44' />
          <Skeleton className='h-4 w-36' />
        </div>
      </div>

      <Skeleton className='my-2 h-4 w-full' />

      <div className='flex items-center gap-2'>
        <Skeleton className='size-5 rounded-full' />
        <Skeleton className='h-4 w-28' />
      </div>

      <div className='flex gap-4'>
        <Skeleton className='size-6 rounded-full' />
        <Skeleton className='size-6 rounded-full' />
        <Skeleton className='size-6 rounded-full' />
        <Skeleton className='size-6 rounded-full' />
      </div>
    </div>
  );
};
