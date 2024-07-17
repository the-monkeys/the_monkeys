'use client';

import { NewsSectionSkeleton } from '@/components/skeletons/newsSkeleton';
import useGetAllNews from '@/hooks/useGetAllNews';
import { NewsSource2 } from '@/lib/types';

import NewsCard from './NewsCard';

const NewsSection = () => {
  const { news, isLoading, error } = useGetAllNews();

  const newsData = news?.articles as NewsSource2[];

  if (isLoading) return <NewsSectionSkeleton />;

  if (error)
    return (
      <p className='py-4 font-jost text-sm text-alert-red text-center'>
        Error fetching news. Try again.
      </p>
    );

  return (
    <div className='grid grid-cols-2 gap-4 md:gap-0'>
      {newsData.map((newsItem, index) => {
        return <NewsCard key={index} {...newsItem} />;
      })}
    </div>
  );
};

export default NewsSection;
