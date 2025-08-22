import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import { twMerge } from 'tailwind-merge';

import Container from '../layout/Container';
import {
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
        <Skeleton className='w-full h-[300px]' />
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
    <div className='px-4 space-y-8'>
      <Container className='py-8 md:py-10 max-w-5xl flex flex-col items-center gap-4'>
        <Skeleton className='h-3 w-28' />

        <div className='pb-2 w-full space-y-2'>
          <Skeleton className='h-9 w-full' />
          <Skeleton className='mx-auto h-9 w-1/2' />
        </div>

        <UserInfoCardSkeleton />
      </Container>

      <Container className='max-w-3xl'>
        <EditorBlockSkeleton />
      </Container>
    </div>
  );
};

export const FeedBlogCardSkeleton = () => {
  return (
    <div className='flex flex-col sm:flex-row gap-[10px] sm:gap-4'>
      <Skeleton className='shrink-0 h-[230px] sm:h-[140px] w-full sm:w-[200px]' />

      <div className='w-full space-y-2'>
        <Skeleton className='h-3 w-[100px]' />

        <div className='w-full space-y-1'>
          <Skeleton className='h-[20px] w-full' />
          <Skeleton className='h-[20px] w-1/2' />
        </div>
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
    <div
      className={twMerge(
        className,
        'flex flex-col sm:flex-row lg:flex-col gap-[10px]'
      )}
    >
      <Skeleton className='shrink-0 h-[200px] sm:h-[260px] lg:h-[350px] w-full sm:w-1/2 lg:w-full' />

      <div className='w-full space-y-2'>
        <Skeleton className='h-3 w-[100px]' />

        <div className='w-full space-y-1'>
          <Skeleton className='hidden sm:block h-[20px] w-full' />
          <Skeleton className='h-[20px] w-full' />
          <Skeleton className='h-[20px] w-1/2' />
        </div>
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
        <Skeleton className='h-3 w-[100px]' />

        <div className='w-full space-y-1'>
          <Skeleton className='h-[20px] w-full' />
          <Skeleton className='h-[20px] w-1/2' />
        </div>
      </div>
    </div>
  );
};

export const TopicsContainerSkeleton = () => {
  return (
    <div className='flex gap-2 flex-wrap'>
      <Skeleton className='h-8 w-[152px] rounded-full' />
      <Skeleton className='h-8 w-[120px] rounded-full' />
      <Skeleton className='h-8 w-[130px] rounded-full' />
      <Skeleton className='h-8 w-[100px] rounded-full' />
      <Skeleton className='h-8 w-[132px] rounded-full' />
      <Skeleton className='h-8 w-[140px] rounded-full' />
      <Skeleton className='h-8 w-[152px] rounded-full' />
      <Skeleton className='h-8 w-[150px] rounded-full' />
      <Skeleton className='h-8 w-[120px] rounded-full' />
    </div>
  );
};

export const FeedSkeleton = () => {
  return (
    <Container className='px-4 py-8 min-h-screen space-y-14'>
      <div className='grid grid-cols-2 gap-8'>
        <TrendingCardLargeSkeleton className='col-span-2 lg:col-span-1' />

        <div className='col-span-2 lg:col-span-1 grid grid-cols-2 gap-8'>
          <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
          <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
          <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
          <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
        </div>
      </div>

      <div className='grid grid-cols-3 gap-8 lg:gap-10 xl:gap-16'>
        <div className='col-span-3 lg:col-span-2 space-y-4'>
          <FeedBlogCardListSkeleton />
        </div>

        <div className='col-span-3 lg:col-span-1 space-y-10'>
          <TopicsContainerSkeleton />

          <div className='grid grid-cols-2 gap-6'>
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

export const FeedBlogCardListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className='w-full space-y-8'>
      {Array.from({ length: count }).map((_, index) => (
        <FeedBlogCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const FeedCategorySectionSkeleton = () => {
  return (
    <div className='space-y-10'>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-8'>
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
    <div className='grid grid-cols-2 lg:grid-cols-3 gap-8'>
      <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
      <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
      <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
      <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
      <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
      <TrendingCardSmallSkeleton className='col-span-2 sm:col-span-1' />
    </div>
  );
};
