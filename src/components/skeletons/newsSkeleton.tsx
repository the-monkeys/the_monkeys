import { Skeleton } from '../ui/skeleton';

export const NewsSectionSkeleton = () => {
  return (
    <div className='grid grid-cols-2 p-2 gap-2 md:gap-0'>
      <Skeleton className='md:m-4 h-60 sm:h-56 md:h-80 col-span-2 md:col-span-1 p-2 md:p-6 rounded-none' />
      <Skeleton className='md:m-4 h-60 sm:h-56 md:h-80 col-span-2 md:col-span-1 p-2 md:p-6 rounded-none' />
      <Skeleton className='md:m-4 h-60 sm:h-56 md:h-80 col-span-2 md:col-span-1 p-2 md:p-6 rounded-none' />
      <Skeleton className='md:m-4 h-60 sm:h-56 md:h-80 col-span-2 md:col-span-1 p-2 md:p-6 rounded-none' />
      <Skeleton className='md:m-4 h-60 sm:h-56 md:h-80 col-span-2 md:col-span-1 p-2 md:p-6 rounded-none' />
      <Skeleton className='md:m-4 h-60 sm:h-56 md:h-80 col-span-2 md:col-span-1 p-2 md:p-6 rounded-none' />
    </div>
  );
};
