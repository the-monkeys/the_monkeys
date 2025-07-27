import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

export const SearchResultsSkeleton = () => {
  return (
    <div className='space-y-2'>
      <Skeleton className='h-[30px] w-full' />
      <Skeleton className='h-[30px] w-full' />
      <Skeleton className='h-[30px] w-full' />
    </div>
  );
};
