import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import { twMerge } from 'tailwind-merge';

export const UserRecommendationCardSkeleton = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div className={twMerge(className, 'w-full flex gap-3')}>
      <Skeleton className='shrink-0 size-10 rounded-full' />

      <div className='w-full space-y-2'>
        <Skeleton className='h-3 w-32' />
        <Skeleton className='h-[10px] w-full' />
        <Skeleton className='h-[10px] w-1/2' />
      </div>
    </div>
  );
};

export const UserInfoCardSkeleton = () => {
  return (
    <div className='flex items-center gap-2'>
      <Skeleton className='size-6 rounded-full' />
      <Skeleton className='h-3 w-32' />
    </div>
  );
};

export const ConnectionCardSkeleton = () => {
  return (
    <div className='flex justify-between items-center'>
      <div className='p-1 space-y-1'>
        <Skeleton className='h-4 w-40' />
        <Skeleton className='h-3 w-32' />
      </div>

      <Skeleton className='h-9 w-28 rounded-full' />
    </div>
  );
};

export const ConnectionsListSkeleton = () => {
  return (
    <div className='space-y-2'>
      <ConnectionCardSkeleton />
      <ConnectionCardSkeleton />
      <ConnectionCardSkeleton />
      <ConnectionCardSkeleton />
      <ConnectionCardSkeleton />
    </div>
  );
};
