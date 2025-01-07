import Container from '../layout/Container';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import {
  UserInfoCardCompactSkeleton,
  UserInfoCardSkeleton,
} from './userSkeleton';

export const EditorBlockSkeleton = () => {
  return (
    <div className='mt-8 h-[800px] w-full bg-gradient-to-b from-foreground-light dark:from-foreground-dark from-[20%] rounded-t-md animate-opacity-pulse' />
  );
};

export const PublishedBlogSkeleton = () => {
  return (
    <Container className='pb-12 min-h-screen grid grid-cols-3 gap-4'>
      <div className='p-4 col-span-3 lg:col-span-2'>
        <UserInfoCardSkeleton />

        <Separator className='mt-4 mb-8' />

        <EditorBlockSkeleton />
      </div>

      <div className='hidden lg:block px-4 col-span-3 lg:col-span-1 space-y-4'>
        <div className='h-64 w-full bg-gradient-to-b from-foreground-light dark:from-foreground-dark from-[20%] rounded-t-md animate-opacity-pulse' />
      </div>
    </Container>
  );
};

export const BlogCardSkeleton = () => {
  return (
    <div className='px-0 lg:px-6 space-y-3'>
      <UserInfoCardCompactSkeleton />

      <Skeleton className='h-28 sm:h-24 w-full' />

      <div className='flex justify-end items-center gap-2'>
        <div className='flex-1'>
          <Skeleton className='h-4 w-28' />
        </div>

        <Skeleton className='size-6 rounded-full' />
        <Skeleton className='size-6 rounded-full' />
      </div>
    </div>
  );
};

export const ShowcaseBlogCardSkeleton = () => {
  return (
    <div className='col-span-2 sm:col-span-1 space-y-2'>
      <UserInfoCardCompactSkeleton />

      <Skeleton className='h-[180px] w-full' />

      <div className='space-y-1'>
        <Skeleton className='h-4 w-full rounded-full' />
        <Skeleton className='h-4 w-4/5 rounded-full' />
      </div>
    </div>
  );
};

export const FeedBlogCardSkeleton = () => {
  return (
    <div className='px-0 lg:px-6 space-y-3'>
      <UserInfoCardSkeleton />

      <Skeleton className='h-28 sm:h-24 w-full' />

      <div className='flex justify-end items-center gap-2'>
        <div className='flex-1'>
          <Skeleton className='h-4 w-28' />
        </div>

        <Skeleton className='size-6 rounded-full' />
        <Skeleton className='size-6 rounded-full' />
      </div>
    </div>
  );
};

export const ShowcaseBlogCardListSkeleton = () => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-y-8 sm:gap-y-10 gap-x-6'>
      <ShowcaseBlogCardSkeleton />
      <ShowcaseBlogCardSkeleton />
      <ShowcaseBlogCardSkeleton />
      <ShowcaseBlogCardSkeleton />
      <ShowcaseBlogCardSkeleton />
      <ShowcaseBlogCardSkeleton />
      <ShowcaseBlogCardSkeleton />
      <ShowcaseBlogCardSkeleton />
    </div>
  );
};

export const BlogCardListSkeleton = () => {
  return (
    <div className='w-full space-y-6 md:space-y-8'>
      <BlogCardSkeleton />
      <BlogCardSkeleton />
      <BlogCardSkeleton />
      <BlogCardSkeleton />
    </div>
  );
};

export const FeedBlogCardListSkeleton = () => {
  return (
    <div className='w-full space-y-6 md:space-y-8'>
      <FeedBlogCardSkeleton />
      <FeedBlogCardSkeleton />
      <FeedBlogCardSkeleton />
      <FeedBlogCardSkeleton />
    </div>
  );
};
