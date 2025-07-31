import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

import { TopicsContainerSkeleton } from './blogSkeleton';

export const AuthorProfileCardSkeleton = () => {
  return (
    <div className='space-y-3'>
      <div className='flex justify-end gap-2'>
        <Skeleton className='size-9 rounded-full' />
        <Skeleton className='size-9 rounded-full' />
      </div>

      <div className='flex items-end gap-2'>
        <Skeleton className='size-[80px] rounded-full' />

        <div className='space-y-1'>
          <Skeleton className='h-3 w-36' />
          <Skeleton className='h-6 w-44' />
        </div>
      </div>

      <div className='py-2 space-y-1'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-1/2' />
      </div>

      <Skeleton className='h-4 w-28' />

      <div className='pt-2 flex gap-2'>
        <Skeleton className='size-9 rounded-full' />
        <Skeleton className='size-9 rounded-full' />
        <Skeleton className='size-9 rounded-full' />
      </div>
    </div>
  );
};

export const AuthorInfoCardSkeleton = () => {
  return (
    <div className='border-1 border-foreground-light/50 dark:border-foreground-dark/50 rounded-md overflow-hidden'>
      <div className='p-4 pb-0 flex items-end gap-3'>
        <Skeleton className='size-[80px] rounded-full' />

        <div className='flex-1 space-y-1'>
          <Skeleton className='h-3 w-32' />
          <Skeleton className='h-5 w-40' />
        </div>
      </div>

      <div className='p-4 space-y-2'>
        <div className='space-y-1'>
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-full' />
        </div>

        <div className='mb-2 flex items-center gap-1'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-4 w-32' />
        </div>
      </div>
    </div>
  );
};

export const ProfileSectionSkeleton = () => {
  return (
    <div className='grid grid-cols-3 gap-4'>
      <div className='col-span-3 md:col-span-2 p-4 bg-foreground-light/20 dark:bg-foreground-dark/20 rounded-lg'>
        <AuthorProfileCardSkeleton />
      </div>

      <div className='col-span-3 md:col-span-1 p-4 bg-foreground-light/20 dark:bg-foreground-dark/20 rounded-lg'>
        <TopicsContainerSkeleton />
      </div>
    </div>
  );
};
