import { useState } from 'react';

import { NewsGridCard } from '@/components/news/cards/GridCard';
import { NewsGridSkeleton } from '@/components/skeletons/newsSkeleton';
import { useGetAllNews2 } from '@/hooks/blog/useGetAllNews';
import { NewsSource2 } from '@/services/news/newsTypes';

export const NewsGrid = () => {
  const { news, isLoading, error } = useGetAllNews2();

  const newsData = news?.articles as NewsSource2[];

  const [visibleCount, setVisibleCount] = useState<number>(19);

  if (isLoading) return <NewsGridSkeleton />;

  if (error)
    return (
      <div className='py-4 min-h-screen'>
        <p className='w-full text-sm opacity-80 text-center'>
          Unable to load news. Please try again later.
        </p>
      </div>
    );

  function handleLoadMoreNews() {
    setVisibleCount((prev) => prev + 10);
  }

  return (
    <div className='space-y-5'>
      <h4 className='font-dm_sans font-medium text-xl'>All News</h4>

      <div className='grid grid-cols-2 gap-x-6 gap-y-8'>
        {newsData
          ?.slice(0, visibleCount)
          .map((newsItem) => (
            <NewsGridCard
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
