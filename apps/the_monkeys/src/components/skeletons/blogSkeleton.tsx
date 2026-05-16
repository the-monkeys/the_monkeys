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

// ---------------------------------------------------------------------------
// Landing-page skeleton — mirrors the exact slot composition in
// LandingPageClient: announcement → authors strip → hero → horizontal
// feature → list items → feature card → minimal pair → list sections.
// ---------------------------------------------------------------------------

const AnnouncementBannerSkeleton = () => (
  <div className='mb-4'>
    <Skeleton className='w-full h-10 rounded-md' />
  </div>
);

const FeaturedAuthorsStripSkeleton = () => (
  <section className='pb-4'>
    <Skeleton className='mb-3 h-3 w-32' />
    <div className='flex gap-4 overflow-hidden pb-2'>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className='flex shrink-0 flex-col items-center gap-2'>
          <Skeleton className='h-20 w-20 rounded-full' />
          <Skeleton className='h-3 w-16 rounded' />
        </div>
      ))}
    </div>
  </section>
);

/** Matches EditorialHero: full-bleed aspect-[16/10] sm:aspect-[16/9] */
const EditorialHeroSkeleton = () => (
  <div className='w-full overflow-hidden rounded-lg'>
    <Skeleton className='w-full aspect-[16/10] sm:aspect-[16/9]' />
  </div>
);

/**
 * Matches HorizontalFeatureCard: 2-col grid, image left (aspect-[4/3] /
 * min-h-[280px] on sm), text block right.
 */
const HorizontalFeatureCardSkeleton = () => (
  <div className='mt-6 w-full overflow-hidden rounded-lg'>
    <div className='grid grid-cols-1 sm:grid-cols-2'>
      <Skeleton className='aspect-[4/3] sm:aspect-auto sm:min-h-[280px] w-full' />
      <div className='flex flex-col p-5 sm:p-6 gap-3'>
        <Skeleton className='h-3 w-20' />
        <div className='space-y-2'>
          <Skeleton className='h-7 w-full' />
          <Skeleton className='h-7 w-4/5' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-11/12' />
          <Skeleton className='h-4 w-3/4' />
        </div>
        <div className='mt-auto pt-5 flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-7 w-7 rounded-full shrink-0' />
            <Skeleton className='h-3 w-24' />
          </div>
          <Skeleton className='h-4 w-12' />
        </div>
      </div>
    </div>
  </div>
);

/**
 * Matches FeedListItem: text block left, small w-20 h-20 / w-24 h-24
 * thumbnail right, separated by a bottom border.
 */
const FeedListItemSkeleton = () => (
  <div className='flex items-start gap-4 sm:gap-6 py-5 border-b border-border-light dark:border-border-dark/40 last:border-b-0'>
    <div className='flex-1 min-w-0 space-y-2'>
      <Skeleton className='h-3 w-20' />
      <div className='space-y-1'>
        <Skeleton className='h-6 w-full' />
        <Skeleton className='h-6 w-3/4' />
      </div>
      <Skeleton className='h-3 w-16' />
      <Skeleton className='h-4 w-20' />
    </div>
    <Skeleton className='shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md' />
  </div>
);

/** Matches FeatureCard: aspect-[16/9] sm:aspect-[2/1] dark overlay card */
const FeatureCardSkeleton = () => (
  <Skeleton className='w-full aspect-[16/9] sm:aspect-[2/1] rounded-lg' />
);

/**
 * Matches MinimalBlogCard: no image, just label + title lines inside a
 * padded rounded card. Used in a 2-col grid.
 */
const MinimalBlogCardSkeleton = () => (
  <div className='h-full p-4 sm:p-5 rounded-md bg-background-light dark:bg-background-dark space-y-3'>
    <Skeleton className='h-3 w-16' />
    <div className='space-y-2'>
      <Skeleton className='h-6 w-full' />
      <Skeleton className='h-6 w-4/5' />
      <Skeleton className='h-6 w-3/5' />
    </div>
    <Skeleton className='h-4 w-20' />
  </div>
);

/** Thin section divider label — matches SectionLabel border-t + text */
const SectionLabelSkeleton = () => (
  <div className='border-t border-border-light dark:border-border-dark/40 pt-4 mt-8 mb-4'>
    <Skeleton className='h-3 w-36' />
  </div>
);

export const FeedSkeleton = () => {
  return (
    <div className='min-h-screen'>
      {/* Announcement banner */}
      <AnnouncementBannerSkeleton />

      {/* Featured authors strip */}
      <FeaturedAuthorsStripSkeleton />

      <div className='mt-4'>
        {/* Hero */}
        <EditorialHeroSkeleton />

        {/* Horizontal feature card */}
        <HorizontalFeatureCardSkeleton />

        {/* First list — 3 rows */}
        <div className='mt-6'>
          {Array.from({ length: 3 }).map((_, i) => (
            <FeedListItemSkeleton key={i} />
          ))}
        </div>

        {/* Weekly Analysis section */}
        <SectionLabelSkeleton />
        <FeatureCardSkeleton />

        {/* Minimal pair — 2-col grid */}
        <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <MinimalBlogCardSkeleton />
          <MinimalBlogCardSkeleton />
        </div>

        {/* Perspectives section — 4 rows */}
        <SectionLabelSkeleton />
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <FeedListItemSkeleton key={i} />
          ))}
        </div>

        {/* More from the Community — 4 rows */}
        <SectionLabelSkeleton />
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <FeedListItemSkeleton key={i} />
          ))}
        </div>
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

export const FeedCategorySectionSkeleton = () => (
  <div className='space-y-10'>
    <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
      {Array.from({ length: 2 }).map((_, i) => (
        <TrendingCardSmallSkeleton
          key={i}
          className='col-span-2 sm:col-span-1'
        />
      ))}
    </div>
    <FeedBlogCardListSkeleton />
  </div>
);

export const BlogPageRecommendationSkeleton = () => (
  <div className='grid grid-cols-2 lg:grid-cols-3 gap-8'>
    {Array.from({ length: 6 }).map((_, i) => (
      <TrendingCardSmallSkeleton key={i} className='col-span-2 sm:col-span-1' />
    ))}
  </div>
);
