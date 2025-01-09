import { useState } from 'react';

import { NewsGridCard } from '@/components/news/cards/GridCard';
import { useGetAllNews2 } from '@/hooks/blog/useGetAllNews';
import { NewsSource2 } from '@/services/news/newsTypes';

export const NewsGrid = () => {
  const { news, isLoading, error } = useGetAllNews2();

  const newsData = news?.articles as NewsSource2[];

  const [visibleCount, setVisibleCount] = useState<number>(19);

  if (isLoading || error) return null;

  function handleLoadMoreNews() {
    setVisibleCount((prev) => prev + 10);
  }

  return (
    <div className='mt-10 space-y-5'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
        {newsData
          ?.slice(0, visibleCount)
          .map((newsItem) => <NewsGridCard key={newsItem.url} {...newsItem} />)}

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
