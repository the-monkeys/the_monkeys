import Container from '../layout/Container';
import { Skeleton } from '../ui/skeleton';

export const PublishedBlogSkeleton = () => {
  return (
    <Container className='min-h-screen px-5 pb-12'>
      <div className='px-1 py-4 mx-auto w-full sm:w-4/5 border-b-1 border-secondary-lightGrey/25 space-y-4 sm:space-y-6'>
        <div className='flex flex-col sm:flex-row justify-between sm:items-end gap-1'>
          <div className='w-full flex flex-col space-y-1'>
            <Skeleton className='h-4 w-1/4 rounded-none' />
            <Skeleton className='h-8 w-3/5 rounded-none' />
          </div>

          <div className='w-full flex flex-col sm:items-end space-y-1'>
            <Skeleton className='h-4 w-1/4 rounded-none' />
            <Skeleton className='h-8 w-1/2 rounded-none' />
          </div>
        </div>

        <div className='flex gap-1 flex-wrap'>
          <Skeleton className='h-6 w-28 rounded-full' />
          <Skeleton className='h-6 w-28 rounded-full' />
          <Skeleton className='h-6 w-28 rounded-full' />
          <Skeleton className='h-6 w-28 rounded-full' />
        </div>
      </div>

      <div className='mt-12 mx-auto w-full sm:w-4/5 space-y-2'>
        <Skeleton className='w-1/4 h-10 rounded-none' />
        <Skeleton className='w-full h-20 rounded-none' />
        <Skeleton className='w-full h-28 rounded-none' />
        <Skeleton className='w-1/2 h-8 rounded-none' />
        <Skeleton className='w-full h-28 rounded-none' />
        <Skeleton className='w-full h-20 rounded-none' />
      </div>
    </Container>
  );
};
