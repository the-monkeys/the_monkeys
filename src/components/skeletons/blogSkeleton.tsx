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
    <>
      <div className='col-span-3 lg:col-span-2'>
        <UserInfoCardSkeleton />

        <Separator className='mt-2 mb-6' />

        <EditorBlockSkeleton />
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

export const ShowcaseBlogCardSkeleton = () => {
  return (
    <div className='col-span-2 sm:col-span-1 space-y-3'>
      <Skeleton className='h-[180px] sm:h-[220px] w-full !rounded-none' />

      <div className='space-y-1'>
        <Skeleton className='h-6 w-full' />
        <Skeleton className='h-6 w-4/5' />
      </div>
    </div>
  );
};

export const FeedBlogCardSkeleton = () => {
  return (
    <div className='px-0 lg:px-6 space-y-3'>
      <UserInfoCardSkeleton />

      <Skeleton className='h-32 md:h-28 w-full' />
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
      <FeedBlogCardSkeleton />
      <FeedBlogCardSkeleton />
      <FeedBlogCardSkeleton />
      <FeedBlogCardSkeleton />
    </div>
  );
};
