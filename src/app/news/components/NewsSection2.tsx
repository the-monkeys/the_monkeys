'use client';

import { useState } from 'react';

import { Source2Card } from '@/components/news/cards/Source2Card';
import { NewsSection2Skeleton } from '@/components/skeletons/newsSkeleton';
import { Separator } from '@/components/ui/separator';
import { useGetAllNews2 } from '@/hooks/blog/useGetAllNews';
import { NewsSource2 } from '@/services/news/newsTypes';

export const NewsSection2 = () => {
  const { news, isLoading, error } = useGetAllNews2();

  const newsData = news?.articles as NewsSource2[];

  const [visibleCount, setVisibleCount] = useState<number>(19);

  if (isLoading) return <NewsSection2Skeleton />;

  if (error)
    return (
      <div className='min-h-screen'>
        <p className='w-full font-roboto text-sm opacity-80 text-center'>
          Unable to load news. Please try again later.
        </p>
      </div>
    );

  function handleLoadMoreNews() {
    setVisibleCount((prev) => prev + 10);
  }

  return (
    <div className='p-4 sm:p-6 bg-foreground-light/50 dark:bg-foreground-dark/50 rounded-xl'>
      <h4 className='px-1 font-dm_sans font-medium text-base sm:text-lg'>
        Explore world news
      </h4>

      <Separator className='mt-1 mb-4 xl:mb-6 bg-border-light dark:bg-border-dark' />

      <div className='grid grid-cols-2 gap-8 sm:gap-6'>
        {newsData
          ?.slice(0, visibleCount)
          .map((newsItem) => (
            <Source2Card
              key={`${newsItem.publishedAt}_${newsItem.author}`}
              {...newsItem}
            />
          ))}

        <div className='py-4 col-span-2 sm:col-span-1 flex items-center justify-center'>
          <button
            className='font-dm_sans text-sm sm:text-base opacity-80 hover:opacity-100'
            onClick={handleLoadMoreNews}
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};
