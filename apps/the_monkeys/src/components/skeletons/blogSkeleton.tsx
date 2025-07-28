import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import { twMerge } from 'tailwind-merge';

import Container from '../layout/Container';
import {
  UserInfoCardCompactSkeleton,
  UserInfoCardSkeleton,
  UserRecommendationCardSkeleton,
} from './userSkeleton';

export const EditorBlockSkeleton = () => {
  return (
    <div className='mt-8 w-full space-y-6'>
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
        <Skeleton className='w-1/4 h-5' />
      </div>

      <div className='space-y-1'>
        <Skeleton className='w-4/5 h-[250px]' />
      </div>

      <div className='space-y-1'>
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-full h-5' />
        <Skeleton className='w-1/2 h-5' />
      </div>

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
        <Skeleton className='w-1/4 h-5' />
      </div>
    </div>
  );
};

export const BlogPageSkeleton = () => {
  return (
    <div className='space-y-10'>
      <Container className='px-4 py-8 md:py-10 max-w-5xl flex flex-col items-center gap-4'>
        <Skeleton className='h-3 w-28' />

        <div className='w-full space-y-2'>
          <Skeleton className='h-9 w-full' />
          <Skeleton className='mx-auto h-9 w-1/2' />
        </div>

        <UserInfoCardSkeleton />
      </Container>

      <Container className='max-w-3xl'>
        <EditorBlockSkeleton />
      </Container>

      <Container className='py-4 max-w-5xl'>
        <div className='flex gap-2 flex-wrap'>
          <Skeleton className='h-8 w-[160px] rounded-full' />
          <Skeleton className='h-8 w-[120px] rounded-full' />
          <Skeleton className='h-8 w-[140px] rounded-full' />
          <Skeleton className='h-8 w-[100px] rounded-full' />
          <Skeleton className='h-8 w-[135px] rounded-full' />
          <Skeleton className='h-8 w-[140px] rounded-full' />
          <Skeleton className='h-8 w-[160px] rounded-full' />
          <Skeleton className='h-8 w-[150px] rounded-full' />
          <Skeleton className='h-8 w-[120px] rounded-full' />
        </div>
      </Container>
    </div>
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

export const FeedBlogCardSkeleton = () => {
  return (
    <div className='flex flex-col sm:flex-row gap-[10px] sm:gap-4'>
      <Skeleton className='h-[230px] sm:h-[120px] w-full sm:w-[200px]' />

      <div className='space-y-2 w-full'>
        <Skeleton className='h-[10px] w-[100px]' />
        <Skeleton className='h-[20px] w-full' />
        <Skeleton className='h-[20px] w-1/2' />
      </div>
    </div>
  );
};

export const TrendingCardLargeSkeleton = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div className={twMerge(className, 'space-y-[10px]')}>
      <Skeleton className='h-[220px] md:h-[360px] w-full' />

      <div className='space-y-2'>
        <Skeleton className='h-[10px] w-[100px]' />
        <Skeleton className='h-[20px] w-full' />
        <Skeleton className='h-[20px] w-full' />
        <Skeleton className='h-[20px] w-1/2' />
      </div>
    </div>
  );
};

export const TrendingCardSmallSkeleton = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div className={twMerge(className, 'space-y-[10px]')}>
      <Skeleton className='h-[220px] w-full' />

      <div className='space-y-2'>
        <Skeleton className='h-[10px] w-[100px]' />
        <Skeleton className='h-[20px] w-full' />
        <Skeleton className='h-[20px] w-1/2' />
      </div>
    </div>
  );
};

export const FeedSkeleton = () => {
  return (
    <Container className='px-4 py-8 min-h-screen space-y-10'>
      <div className='grid grid-cols-2 gap-8'>
        <TrendingCardLargeSkeleton className='col-span-2 sm:col-span-1' />

        <div className='col-span-2 md:col-span-1 grid grid-cols-2 gap-6'>
          <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
          <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
          <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
          <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
        </div>
      </div>

      <div className='grid grid-cols-3 gap-8 lg:gap-10 xl:gap-16'>
        <div className='col-span-3 sm:col-span-2 space-y-4'>
          <FeedBlogCardListSkeleton />
        </div>

        <div className='col-span-3 sm:col-span-1 space-y-10'>
          <div className='flex gap-2 flex-wrap'>
            <Skeleton className='h-8 w-[160px] rounded-full' />
            <Skeleton className='h-8 w-[120px] rounded-full' />
            <Skeleton className='h-8 w-[140px] rounded-full' />
            <Skeleton className='h-8 w-[100px] rounded-full' />
            <Skeleton className='h-8 w-[135px] rounded-full' />
            <Skeleton className='h-8 w-[140px] rounded-full' />
            <Skeleton className='h-8 w-[160px] rounded-full' />
            <Skeleton className='h-8 w-[150px] rounded-full' />
            <Skeleton className='h-8 w-[120px] rounded-full' />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <UserRecommendationCardSkeleton className='col-span-2 sm:col-span-1 md:col-span-2' />
            <UserRecommendationCardSkeleton className='col-span-2 sm:col-span-1 md:col-span-2' />
            <UserRecommendationCardSkeleton className='col-span-2 sm:col-span-1 md:col-span-2' />
            <UserRecommendationCardSkeleton className='col-span-2 sm:col-span-1 md:col-span-2' />
            <UserRecommendationCardSkeleton className='col-span-2 sm:col-span-1 md:col-span-2' />
          </div>
        </div>
      </div>

      <FeedCategorySectionSkeleton />
    </Container>
  );
};

export const FeedBlogCardListSkeleton = () => {
  return (
    <div className='w-full space-y-6'>
      <FeedBlogCardSkeleton />
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
        <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
        <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
        <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
      </div>

      <FeedBlogCardListSkeleton />
    </div>
  );
};

export const BlogPageRecommendationSkeleton = () => {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-3 gap-6'>
      <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
      <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
      <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
      <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
      <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
      <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
    </div>
  );
};
