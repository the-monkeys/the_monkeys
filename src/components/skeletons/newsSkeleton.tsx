import { Skeleton } from '../ui/skeleton';

export const NewsCategoriesSkeleton = () => {
  return (
    <div className='space-y-2'>
      <Skeleton className='h-36 w-full' />
      <Skeleton className='h-36 w-full' />
      <Skeleton className='h-36 w-full' />
      <Skeleton className='h-36 w-full' />
      <Skeleton className='h-36 w-full' />
      <Skeleton className='h-36 w-full' />
    </div>
  );
};

export const NewsGridSkeleton = () => {
  return (
    <div className='grid grid-cols-2 gap-6'>
      <Skeleton className='h-52 col-span-2 sm:col-span-1' />
      <Skeleton className='h-52 col-span-2 sm:col-span-1' />
      <Skeleton className='h-52 col-span-2 sm:col-span-1' />
      <Skeleton className='h-52 col-span-2 sm:col-span-1' />
      <Skeleton className='h-52 col-span-2 sm:col-span-1' />
      <Skeleton className='h-52 col-span-2 sm:col-span-1' />
      <Skeleton className='h-52 col-span-2 sm:col-span-1' />
      <Skeleton className='h-52 col-span-2 sm:col-span-1' />
    </div>
  );
};
