'use client';

import { useState } from 'react';

import { NewsSection2Skeleton } from '@/components/skeletons/newsSkeleton';
import { Button } from '@/components/ui/button';
import { useGetAllNews2 } from '@/hooks/useGetAllNews';
import { NewsSource2 } from '@/services/news/newsTypes';

import { Source2Card } from './news/Source2Card';

export const NewsSection2 = () => {
  const { news, isLoading, error } = useGetAllNews2();

  const newsData = news?.articles as NewsSource2[];

  const [visibleCount, setVisibleCount] = useState(15);

  if (isLoading) return <NewsSection2Skeleton />;

  if (error)
    return (
      <p className='py-4 font-jost text-sm text-alert-red text-center'>
        Error fetching news. Try again.
      </p>
    );

  function handleLoadMoreNews() {
    setVisibleCount((prev) => prev + 10);
  }

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {newsData
          ?.slice(0, visibleCount)
          .map((newsItem) => (
            <Source2Card key={newsItem.publishedAt} {...newsItem} />
          ))}
      </div>

      {visibleCount < newsData?.length && (
        <Button
          variant='ghost'
          onClick={handleLoadMoreNews}
          className='w-full rounded-none'
        >
          Read More
        </Button>
      )}
    </div>
  );
};
