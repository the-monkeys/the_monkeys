import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

export const SearchResultSkeleton = () => {
  return (
    <div className='space-y-2'>
      <Skeleton className='h-[40px] w-full' />
      <Skeleton className='h-[40px] w-full' />
      <Skeleton className='h-[40px] w-full' />
      <Skeleton className='h-[40px] w-full' />
    </div>
  );
};
