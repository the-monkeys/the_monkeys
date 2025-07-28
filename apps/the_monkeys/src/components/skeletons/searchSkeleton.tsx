import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

export const SearchResultsPostSkeleton = () => {
  return (
    <div className='space-y-2'>
      <Skeleton className='h-[30px] w-full' />
      <Skeleton className='h-[30px] w-full' />
      <Skeleton className='h-[30px] w-full' />
    </div>
  );
};

export const SearchResultsAuthorSkeleton = () => {
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        <Skeleton className='size-8 rounded-full' />
        <Skeleton className='h-4 w-32' />
      </div>

      <div className='flex items-center gap-2'>
        <Skeleton className='size-8 rounded-full' />
        <Skeleton className='h-4 w-32' />
      </div>

      <div className='flex items-center gap-2'>
        <Skeleton className='size-8 rounded-full' />
        <Skeleton className='h-4 w-32' />
      </div>
    </div>
  );
};
