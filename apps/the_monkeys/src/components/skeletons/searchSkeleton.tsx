import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

export const SearchResultsPostSkeleton = () => {
  return (
    <div className='space-y-2'>
      <div className='p-1 w-full space-y-1'>
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-1/2' />
      </div>

      <div className='p-1 w-full space-y-1'>
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-1/2' />
      </div>

      <div className='p-1 w-full space-y-1'>
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-1/2' />
      </div>
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
