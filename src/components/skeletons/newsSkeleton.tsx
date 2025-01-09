import { Skeleton } from '../ui/skeleton';

export const NewsCategoriesSkeleton = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      <div className='col-span-1 divide-y-4 divide-background-light dark:divide-background-dark'>
        <Skeleton className='w-full h-32 rounded-none' />
        <Skeleton className='w-full h-32 rounded-none' />
        <Skeleton className='w-full h-32 rounded-none' />
        <Skeleton className='w-full h-32 rounded-none' />
      </div>

      <div className='col-span-1 divide-y-4 divide-background-light dark:divide-background-dark'>
        <Skeleton className='w-full h-32 rounded-none' />
        <Skeleton className='w-full h-32 rounded-none' />
        <Skeleton className='w-full h-32 rounded-none' />
        <Skeleton className='w-full h-32 rounded-none' />
      </div>

      <div className='col-span-1 divide-y-4 divide-background-light dark:divide-background-dark'>
        <Skeleton className='w-full h-32 rounded-none' />
        <Skeleton className='w-full h-32 rounded-none' />
        <Skeleton className='w-full h-32 rounded-none' />
        <Skeleton className='w-full h-32 rounded-none' />
      </div>
    </div>
  );
};

export const NewsGridSkeleton = () => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
      <Skeleton className='h-52 col-span-2 sm:col-span-1 rounded-sm' />
      <Skeleton className='h-52 col-span-2 sm:col-span-1 rounded-sm' />
      <Skeleton className='h-52 col-span-2 sm:col-span-1 rounded-sm' />
      <Skeleton className='h-52 col-span-2 sm:col-span-1 rounded-sm' />
      <Skeleton className='h-52 col-span-2 sm:col-span-1 rounded-sm' />
      <Skeleton className='h-52 col-span-2 sm:col-span-1 rounded-sm' />
      <Skeleton className='h-52 col-span-2 sm:col-span-1 rounded-sm' />
      <Skeleton className='h-52 col-span-2 sm:col-span-1 rounded-sm' />
    </div>
  );
};
