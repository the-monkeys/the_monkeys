import { Skeleton } from '../ui/skeleton';

export const UpdateDetailsFormSkeleton = () => {
  return (
    <div className='space-y-4'>
      <div className='pt-2 space-y-2'>
        <Skeleton className='h-4 w-1/4 rounded-full' />
        <Skeleton className='h-10 w-full rounded-md' />
      </div>

      <div className='pt-2 space-y-2'>
        <Skeleton className='h-4 w-1/4 rounded-full' />
        <Skeleton className='h-10 w-full rounded-md' />
      </div>

      <div className='pt-2 space-y-2'>
        <Skeleton className='h-4 w-1/4 rounded-full' />
        <Skeleton className='h-10 w-full rounded-md' />
      </div>

      <div className='pt-2 space-y-2'>
        <Skeleton className='h-4 w-1/4 rounded-full' />
        <Skeleton className='h-10 w-full rounded-md' />
      </div>

      <div className='pt-4'>
        <Skeleton className='w-40 h-10 float-right' />
      </div>
    </div>
  );
};

export const LoginFormSkeleton = () => {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Skeleton className='h-10 w-full rounded-md' />
        <Skeleton className='h-10 w-full rounded-md' />
        <Skeleton className='h-10 w-full rounded-md' />
      </div>

      <div className='space-y-3'>
        <Skeleton className='h-10 w-full rounded-md' />
        <Skeleton className='h-10 w-full rounded-md' />
      </div>
    </div>
  );
};
