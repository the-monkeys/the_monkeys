import Container from '../layout/Container';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import {
  UserInfoCardCompactSkeleton,
  UserInfoCardSkeleton,
} from './userSkeleton';

export const PublishedBlogSkeleton = () => {
  return (
    <Container className='pb-12 min-h-screen grid grid-cols-3 gap-4'>
      <div className='p-4 col-span-3 md:col-span-2'>
        <div>
          <UserInfoCardSkeleton />

          <div className='mt-2 mb-4 flex items-center gap-1 flex-wrap'>
            <Skeleton className='h-5 w-20 rounded-full' />
            <Skeleton className='h-5 w-20 rounded-full' />
            <Skeleton className='h-5 w-20 rounded-full' />
          </div>

          <div className='flex items-center gap-2'>
            <Skeleton className='size-8 rounded-full' />
            <Skeleton className='size-8 rounded-full' />
            <Skeleton className='size-8 rounded-full' />
          </div>
        </div>

        <Separator className='mt-4 mb-8' />

        <div className='mx-auto space-y-2'>
          <Skeleton className='w-full h-44' />
          <Skeleton className='w-full h-44' />
          <Skeleton className='w-full h-44' />
        </div>
      </div>

      <div className='px-4 col-span-3 md:col-span-1 space-y-4'>
        <Skeleton className='h-44 w-full' />
        <Skeleton className='h-28 w-full' />
      </div>
    </Container>
  );
};

export const BlogListCardSkeleton = () => {
  return (
    <div className='md:px-6 space-y-2'>
      <UserInfoCardCompactSkeleton />

      <Skeleton className='h-28 sm:h-24 w-full' />

      <Skeleton className='w-full h-6' />
    </div>
  );
};

export const FeedListCardSkeleton = () => {
  return (
    <div className='md:px-6 space-y-2'>
      <UserInfoCardCompactSkeleton />

      <Skeleton className='h-28 sm:h-24 w-full' />

      <Skeleton className='w-full h-6' />
    </div>
  );
};
