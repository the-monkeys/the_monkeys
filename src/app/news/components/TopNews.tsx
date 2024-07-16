'use client';

import { TopHeadlinesSkeleton } from '@/components/skeletons/newsSkeleton';
import useGetTopHeadlines from '@/hooks/useGetTopHeadlines';

const TopNews = () => {
  const { data, isLoading, error } = useGetTopHeadlines();

  const newsData = data as string[];

  if (isLoading) return <TopHeadlinesSkeleton />;

  if (error)
    return (
      <p className='py-4 font-jost text-sm text-alert-red text-center'>
        Error fetching global headlines.
      </p>
    );

  return (
    <div>
      {newsData &&
        newsData.slice(0, 15).map((newsItem, index) => (
          <div key={index}>
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
