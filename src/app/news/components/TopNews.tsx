'use client';

import { Loader } from '@/components/loader';
import useGetTopHeadlines from '@/hooks/useGetTopHeadlines';
import { NewsSource3 } from '@/services/news/newsTypes';

const TopNews = () => {
  const { topHeadlines, isLoading, error } = useGetTopHeadlines();

  const newsData = topHeadlines as NewsSource3;

  if (isLoading)
    return (
      <div className='mt-4 space-y-2'>
        <Loader className='mx-auto' />

        <p className='font-jost text-sm text-center'>
          Fetching latest headlines for you
        </p>
      </div>
    );

  if (error)
    return (
      <p className='py-4 font-jost text-sm text-alert-red text-center'>
        Error fetching global headlines. Try again.
      </p>
    );

  return (
    <div className='hidden md:block'>
      {newsData &&
        newsData.slice(0, 15).map((newsItem, index) => (
          <div key={index} className='hover:pl-1 transition-all'>
            <p className='mb-1 font-playfair_Display font-medium text-3xl text-secondary-darkGrey/25 dark:text-secondary-white/25'>
              {index + 1}.
            </p>

            <p className='pb-2 w-fit font-jost cursor-default'>{newsItem}</p>
          </div>
        ))}
    </div>
  );
};

export default TopNews;
