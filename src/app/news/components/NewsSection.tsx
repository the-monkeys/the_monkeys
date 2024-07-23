'use client';

import { NewsSectionSkeleton } from '@/components/skeletons/newsSkeleton';
import { useGetAllNews1, useGetAllNews2 } from '@/hooks/useGetAllNews';
import { NewsSource1, NewsSource2 } from '@/services/news/newsTypes';

// for news source 1
import News1Card from './News1Card';

// for news source 2
// import News2Card from './News2Card';

const NewsSection = () => {
  // for news source 1
  const { news, isLoading, error } = useGetAllNews1();

  // for news source 2
  // const { news, isLoading, error } = useGetAllNews2();

  // for news source 1
  const newsData = news?.data as NewsSource1[];

  // for news source 2
  // const newsData = news?.articles as NewsSource2[];

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
        // for news source 1
        if (newsItem?.language !== 'en') return null;
        return <News1Card key={index} {...newsItem} />;

        // for news source 2
        // return <News2Card key={index} {...newsItem} />;
      })}
    </div>
  );
};

export default NewsSection;
