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
      <div className='p-4 col-span-3 lg:col-span-2'>
        <div>
          <UserInfoCardSkeleton />

          <div className='mt-2 flex items-center gap-2'>
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

      <div className='hidden lg:block px-4 col-span-3 lg:col-span-1 space-y-4'>
        <div className='h-64 w-full bg-gradient-to-b from-foreground-light dark:from-foreground-dark from-[20%] rounded-t-md' />
      </div>
    </Container>
  );
};

export const BlogCardSkeleton = () => {
  return (
    <div className='md:px-6 space-y-2'>
      <UserInfoCardCompactSkeleton />

      <Skeleton className='h-28 sm:h-24 w-full' />

      <div className='flex justify-end gap-1'>
        <Skeleton className='size-6 rounded-full' />
        <Skeleton className='size-6 rounded-full' />
      </div>
    </div>
  );
};
