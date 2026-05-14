import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import { twMerge } from 'tailwind-merge';

import Container from '../layout/Container';
import { UserInfoCardSkeleton } from './userSkeleton';

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
    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
      <Skeleton className='shrink-0 aspect-[3/2] h-[200px] sm:h-fit w-full sm:w-[200px]' />

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
    <div className={twMerge(className, 'space-y-3')}>
      <Skeleton className='aspect-[3/2] h-[220px] sm:h-fit max-h-[300px] w-full' />

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
    <div className='min-h-screen'>
      <section className='pb-4'>
        <Skeleton className='mb-3 h-4 w-32' />

        <div className='flex gap-4 overflow-hidden pb-2'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='flex shrink-0 flex-col items-center gap-2'
            >
              <Skeleton className='h-20 w-20 rounded-full' />
              <Skeleton className='h-3 w-16 rounded' />
            </div>
          ))}
        </div>
      </section>

      <div className='flex flex-col'>
        <FeedBlogCardHorizontalSkeleton />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6'>
          {Array.from({ length: 8 }).map((_, index) => (
            <FeedBlogCardGridSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FeedBlogCardHorizontalSkeleton = () => {
  return (
    <div className='pb-10 w-full'>
      <article className='flex flex-col md:flex-row overflow-hidden'>
        <Skeleton className='md:w-[40%] aspect-[3/2] md:aspect-auto w-full shrink-0' />

        <div className='md:w-[60%] px-6 py-8 md:px-10 flex flex-col justify-between gap-8'>
          <div className='space-y-4'>
            <Skeleton className='h-3 w-24' />

            <div className='space-y-2'>
              <Skeleton className='h-9 w-full' />
              <Skeleton className='h-9 w-5/6' />
              <Skeleton className='h-9 w-2/3' />
            </div>

            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-11/12' />
              <Skeleton className='h-4 w-3/4' />
            </div>
          </div>

          <FeedBlogCardMetaSkeleton />
        </div>
      </article>
    </div>
  );
};

const FeedBlogCardGridSkeleton = () => {
  return (
    <div className='pb-8'>
      <article className='flex flex-col'>
        <Skeleton className='aspect-[16/9] w-full' />

        <div className='mt-6 flex flex-col gap-3'>
          <Skeleton className='h-3 w-24' />

          <div className='space-y-2'>
            <Skeleton className='h-7 w-full' />
            <Skeleton className='h-7 w-4/5' />
          </div>

          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
          </div>
        </div>

        <FeedBlogCardMetaSkeleton />
      </article>
    </div>
  );
};

const FeedBlogCardMetaSkeleton = () => {
  return (
    <div className='mt-8 pt-4 border-t border-gray-50 dark:border-border-dark flex justify-between items-center gap-4'>
      <div className='flex items-center gap-4 min-w-0'>
        <Skeleton className='h-8 w-8 rounded-full shrink-0' />
        <Skeleton className='h-3 w-24' />
        <Skeleton className='hidden sm:block h-3 w-20' />
      </div>

      <div className='flex items-center gap-4 shrink-0'>
        <Skeleton className='h-5 w-10' />
        <Skeleton className='h-5 w-5 rounded-full' />
      </div>
    </div>
  );
};

export const FeedBlogCardListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className='w-full max-w-4xl space-y-8'>
      {Array.from({ length: count }).map((_, index) => (
        <FeedBlogCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const FeedCategorySectionSkeleton = () => {
  return (
    <div className='space-y-10'>
      <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
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
