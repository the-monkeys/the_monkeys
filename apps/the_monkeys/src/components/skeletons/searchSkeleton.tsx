import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

export const SearchBlogTitlesSkeleton = () => {
  return (
    <div className='space-y-2'>
      <Skeleton className='h-[40px] w-full' />
      <Skeleton className='h-[40px] w-full' />
      <Skeleton className='h-[40px] w-full' />
    </div>
  );
};
