import { Skeleton } from '../ui/skeleton';

export const NewsSection1Skeleton = () => {
  return (
    <div className='grid grid-cols-2 gap-4 md:gap-0'>
      <Skeleton className='md:m-4 h-60 sm:h-56 md:h-80 col-span-2 md:col-span-1 p-2 md:p-6 rounded-none' />
      <Skeleton className='md:m-4 h-60 sm:h-56 md:h-80 col-span-2 md:col-span-1 p-2 md:p-6 rounded-none' />
      <Skeleton className='md:m-4 h-60 sm:h-56 md:h-80 col-span-2 md:col-span-1 p-2 md:p-6 rounded-none' />
      <Skeleton className='md:m-4 h-60 sm:h-56 md:h-80 col-span-2 md:col-span-1 p-2 md:p-6 rounded-none' />
      <Skeleton className='md:m-4 h-60 sm:h-56 md:h-80 col-span-2 md:col-span-1 p-2 md:p-6 rounded-none' />
      <Skeleton className='md:m-4 h-60 sm:h-56 md:h-80 col-span-2 md:col-span-1 p-2 md:p-6 rounded-none' />
    </div>
  );
};

export const NewsSection2Skeleton = () => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-4'>
      {Array.from({ length: 15 }).map((_, index) => (
        <Skeleton
          key={index}
          className='h-60 col-span-2 sm:col-span-1 rounded-none'
        />
      ))}
    </div>
  );
};
