import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

import Container from '../layout/Container';
import {
  UserInfoCardCompactSkeleton,
  UserInfoCardSkeleton,
} from './userSkeleton';

export const EditorBlockSkeleton = () => {
  return (
    <div className='mt-8 h-[800px] w-full space-y-6'>
      <div className='space-y-1'>
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-4/5 h-5' />
      </div>

      <div className='space-y-1'>
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-1/4 h-5' />
      </div>

      <div className='space-y-1'>
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-full h-5' />
      </div>

      <div className='space-y-1'>
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-1/2 h-5' />
      </div>
    </div>
  );
};

export const PublishedBlogSkeleton = () => {
  return (
    <>
      <div className='col-span-3 lg:col-span-2'>
        <UserInfoCardSkeleton />

        <div className='mt-8 h-[800px] w-full bg-gradient-to-b from-foreground-light dark:from-foreground-dark from-[20%] rounded-t-md animate-opacity-pulse' />
      </div>

      <div className='hidden lg:block col-span-3 lg:col-span-1 space-y-4'>
        <div className='h-64 w-full bg-gradient-to-b from-foreground-light dark:from-foreground-dark from-[20%] rounded-t-md animate-opacity-pulse' />
      </div>
    </>
  );
};

export const BlogCardSkeleton = () => {
  return (
    <div className='px-0 lg:px-6 space-y-3'>
      <UserInfoCardCompactSkeleton />

      <Skeleton className='h-32 md:h-28 w-full' />
    </div>
  );
};

export const FeedBlogCardSkeleton = () => {
  return <Skeleton className='h-32 md:h-28 w-full' />;
};

export const ShowcaseBlogCardListSkeleton = () => {
  return (
    <Container className='px-4 py-8 min-h-screen space-y-8'>
      <div className='grid grid-cols-2 gap-6'>
        <Skeleton className='col-span-2 md:col-span-1 w-full h-[300px] md:h-full' />

        <div className='col-span-2 md:col-span-1 grid grid-cols-2 gap-4'>
          <Skeleton className='col-span-2 sm:col-span-1 h-[200px] w-full' />
          <Skeleton className='col-span-2 sm:col-span-1 h-[200px] w-full' />
          <Skeleton className='col-span-2 sm:col-span-1 h-[200px] w-full' />
          <Skeleton className='col-span-2 sm:col-span-1 h-[200px] w-full' />
        </div>
      </div>

      <div className='grid grid-cols-3 gap-6'>
        <div className='col-span-3 sm:col-span-2 space-y-4'>
          <Skeleton className='h-[200px] md:h-[150px] w-full' />
          <Skeleton className='h-[200px] md:h-[150px] w-full' />
          <Skeleton className='h-[200px] md:h-[150px] w-full' />
          <Skeleton className='h-[200px] md:h-[150px] w-full' />
          <Skeleton className='h-[200px] md:h-[150px] w-full' />
        </div>

        <Skeleton className='hidden sm:block col-span-1 h-full w-full' />
      </div>
    </Container>
  );
};

export const BlogCardListSkeleton = () => {
  return (
    <div className='w-full space-y-8'>
      <BlogCardSkeleton />
      <BlogCardSkeleton />
      <BlogCardSkeleton />
      <BlogCardSkeleton />
      <BlogCardSkeleton />
    </div>
  );
};

export const FeedBlogCardListSkeleton = () => {
  return (
    <div className='w-full space-y-6'>
      <FeedBlogCardSkeleton />
      <FeedBlogCardSkeleton />
      <FeedBlogCardSkeleton />
      <FeedBlogCardSkeleton />
    </div>
  );
};

export const FeedCategorySectionSkeleton = () => {
  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
        <Skeleton className='col-span-2 sm:col-span-1 h-[180px] w-full' />
        <Skeleton className='col-span-2 sm:col-span-1 h-[180px] w-full' />
        <Skeleton className='col-span-2 sm:col-span-1 h-[180px] w-full' />
      </div>

      <FeedBlogCardListSkeleton />
    </div>
  );
};
