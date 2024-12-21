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
    <div className='p-4 bg-foreground-light/25 dark:bg-foreground-dark/25 border-1 border-border-light/25 dark:border-border-dark/25 rounded-xl space-y-2'>
      <div className='flex items-end gap-1'>
        <Skeleton className='size-16 sm:size-20 rounded-full' />

        <Skeleton className='h-6 w-32' />
      </div>

      <div className='space-y-1'>
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-1/2' />
      </div>

      <div className='flex gap-2'>
        <Skeleton className='h-4 w-28' />
        <Skeleton className='h-4 w-28' />
      </div>
    </div>
  );
};
