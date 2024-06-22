import { Skeleton } from '../ui/skeleton';

export const ProfileCardSkeleton = () => {
  return (
    <div>
      <div className='mb-2 flex flex-wrap items-end gap-2'>
        <Skeleton className='size-32 rounded-full' />

        <div className='py-1 space-y-2'>
          <Skeleton className='h-5 w-44 rounded-full' />
          <Skeleton className='h-4 w-36 rounded-full' />
        </div>
      </div>

      <div className='py-2 space-y-2'>
        <Skeleton className='h-4 w-full rounded-full' />

        <Skeleton className='h-4 w-full rounded-full' />
      </div>

      <Skeleton className='my-2 h-4 w-32 rounded-full' />

      <div className='mt-2 flex gap-4'>
        <Skeleton className='size-6 rounded-full' />
        <Skeleton className='size-6 rounded-full' />
        <Skeleton className='size-6 rounded-full' />
        <Skeleton className='size-6 rounded-full' />
      </div>
    </div>
  );
};
