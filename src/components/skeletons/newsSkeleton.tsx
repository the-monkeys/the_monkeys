import { Skeleton } from '../ui/skeleton';

export const NewsSectionSkeleton = () => {
  return (
    <div className='grid grid-cols-2 gap-4'>
      <Skeleton className='md:m-4 h-60 sm:h-40 md:h-80 col-span-2 md:col-span-1 md:p-6 rounded-none'></Skeleton>
      <Skeleton className='md:m-4 h-60 sm:h-40 md:h-80 col-span-2 md:col-span-1 md:p-6 rounded-none'></Skeleton>
      <Skeleton className='md:m-4 h-60 sm:h-40 md:h-80 col-span-2 md:col-span-1 md:p-6 rounded-none'></Skeleton>
      <Skeleton className='md:m-4 h-60 sm:h-40 md:h-80 col-span-2 md:col-span-1 md:p-6 rounded-none'></Skeleton>
      <Skeleton className='md:m-4 h-60 sm:h-40 md:h-80 col-span-2 md:col-span-1 md:p-6 rounded-none'></Skeleton>
      <Skeleton className='md:m-4 h-60 sm:h-40 md:h-80 col-span-2 md:col-span-1 md:p-6 rounded-none'></Skeleton>
    </div>
  );
};
