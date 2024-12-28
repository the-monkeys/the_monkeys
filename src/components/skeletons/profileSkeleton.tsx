import { Skeleton } from '../ui/skeleton';

export const ProfileCardSkeleton = () => {
  return (
    <div className='space-y-2'>
      <Skeleton className='size-[80px] md:size-[100px] rounded-full' />

      <div className='space-y-1'>
        <Skeleton className='h-6 w-44' />
        <Skeleton className='h-3 w-36' />
      </div>

      <div className='space-y-1'>
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-full' />
      </div>

      <div className='flex gap-2'>
        <Skeleton className='h-4 w-28' />
        <Skeleton className='h-4 w-28' />
      </div>
    </div>
  );
};

export const ProfileInfoCardSkeleton = () => {
  return (
    <div className='border-1 border-border-light/25 dark:border-border-dark/25 shadow-md rounded-lg overflow-hidden'>
      <div className='p-4 pb-0 flex items-end gap-3'>
        <Skeleton className='size-[80px] rounded-full' />

        <div className='flex-1 space-y-1'>
          <Skeleton className='h-3 w-32' />
          <Skeleton className='h-5 w-40' />
        </div>
      </div>

      <div className='p-4 space-y-2'>
        <div className='mb-2 flex items-center gap-1'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-4 w-32' />
        </div>

        <div className='space-y-1'>
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-full' />
        </div>
      </div>
    </div>
  );
};
