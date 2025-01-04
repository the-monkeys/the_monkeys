import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

export const NewsSection1Skeleton = () => {
  return (
    <div className='px-4 py-6 flex flex-col items-center gap-2'>
      <Skeleton className='w-36 h-4' />

      <Skeleton className='h-4 w-full' />

      <Skeleton className='h-3 w-full sm:w-4/5' />

      <div className='py-4 flex justify-center gap-2'>
        <Skeleton className='size-8 rounded-full' />
        <Skeleton className='size-8 rounded-full' />
      </div>
    </div>
  );
};

export const NewsSection2Skeleton = () => {
  return (
    <div className='p-4 sm:p-6 bg-foreground-light/50 dark:bg-foreground-dark/50 rounded-xl'>
      <h4 className='px-1 font-dm_sans font-medium text-base sm:text-lg'>
        Explore world news
      </h4>

      <Separator className='mt-1 mb-4' />

      <div className='grid grid-cols-2 gap-6'>
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={index}
            className='h-40 sm:h-36 col-span-2 sm:col-span-1 rounded-lg'
          />
        ))}
      </div>
    </div>
  );
};

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
