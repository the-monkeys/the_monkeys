import { Skeleton } from '@/components/ui/skeleton';

export const LoginFormSkeleton = () => {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-10 w-full rounded-md' />
      <Skeleton className='h-10 w-full rounded-md' />
      <Skeleton className='h-10 w-full rounded-md' />
      <Skeleton className='h-10 w-full rounded-md' />
    </div>
  );
};
