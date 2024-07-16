'use client';

import { newsData } from '@/constants/news';
import useGetAllNews from '@/hooks/useGetAllNews';
import { NewsItem } from '@/lib/types';

import NewsCard from './NewsCard';

const NewsSection = () => {
  // const { data, isLoading, error } = useGetAllNews();

  // const newsData = data as NewsItem[];

  // if (isLoading) return <p>loading...</p>;

  // if (error)
  //   return (
  //     <p className='py-4 font-jost text-sm text-alert-red text-center'>
  //       Error fetching global headlines.
  //     </p>
  //   );

  return (
    <div className='grid grid-cols-2'>
      {newsData.map((newsItem, index) => {
        return <NewsCard key={index} {...newsItem} />;
      })}
    </div>
  );
};

export default NewsSection;
