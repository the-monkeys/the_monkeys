import Container from '../layout/Container';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

export const BlogOwnerInfoSkeleton = () => {
  return (
    <div className='flex items-center flex-wrap gap-2'>
      <Skeleton className='size-12 rounded-full' />

      <div className='flex-1 space-y-1'>
        <Skeleton className='w-28 sm:w-44 h-8' />
        <Skeleton className='w-4/5 sm:w-44 h-4' />
      </div>
    </div>
  );
};

export const BlogUserInfoSkeleton = () => {
  return (
    <div className='mb-2 flex items-center gap-2'>
      <Skeleton className='size-6 rounded-full' />

      <Skeleton className='h-4 w-28' />

      <Skeleton className='h-4 w-20' />
    </div>
  );
};

export const PublishedBlogSkeleton = () => {
  return (
    <Container className='min-h-screen px-5 pb-12 space-y-4'>
      <div className='pt-4 mx-auto w-full sm:w-4/5 space-y-4'>
        <BlogOwnerInfoSkeleton />

        <div className='flex items-center gap-1 flex-wrap'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-20' />
        </div>

        <div className='flex justify-end items-center gap-3'>
          <Skeleton className='size-8 rounded-full' />
          <Skeleton className='size-8 rounded-full' />
          <Skeleton className='size-8 rounded-full' />
        </div>
      </div>

      <Separator />

      <div className='mx-auto w-full sm:w-4/5 space-y-2'>
        <Skeleton className='w-full h-10' />
        <Skeleton className='w-full h-40' />
        <Skeleton className='w-full h-40' />
      </div>
    </Container>
  );
};

export const BlogListCardSkeleton = () => {
  return (
    <div className='md:px-6'>
      <BlogUserInfoSkeleton />

      <Skeleton className='h-36 sm:h-40 w-full' />
    </div>
  );
};
