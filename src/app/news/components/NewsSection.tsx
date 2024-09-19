'use client';

import Image from 'next/image';

import { NewsSectionSkeleton } from '@/components/skeletons/newsSkeleton';
import { useGetAllNews1, useGetAllNews2 } from '@/hooks/useGetAllNews';
import { NewsSource1, NewsSource2 } from '@/services/news/newsTypes';

import CollageHomepage from './CollageCard';
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

  if (newsData) {
    const seen = new Set();
    const uniqueNewsData = newsData.filter((item) => {
      const identifier = item.title.slice(0, 50) + item.title.slice(0, 50);
      if (seen.has(identifier)) {
        return false; // duplicate found, filter it out
      }
      seen.add(identifier); // add unique combination to the set
      return true; // keep the item
    });

    const newsDataWithUniqueTitleAndImage = uniqueNewsData.filter((item) => {
      if (item.image == null) return null;

      if (
        item.image !== null &&
        (item.image.endsWith('jpg') || item.image.endsWith('img'))
      )
        if (item.title.slice(0, 25) !== item.description.slice(0, 25)) {
          return item;
        }
    });

    const newsWithNoImage = uniqueNewsData.filter((item) => item.image == null);

    return (
      <div className='grid grid-cols-2 gap-4 md:gap-0'>
        {newsDataWithUniqueTitleAndImage.map((newsItem, index) => {
          // for news source 1
          if (newsItem?.language !== 'en') return null;
          return (
            <>
              <div className=' flex flex-col'>
                <News1Card key={index} {...newsItem} />
                <div className='border p-3'>
                  {
                    newsWithNoImage[
                      Math.floor(Math.random() * newsWithNoImage.length)
                    ].title
                  }
                </div>
              </div>
            </>
          );
          // for news source 2
          {
            /* // return <News2Card key={index} {...newsItem} />; */
          }
        })}
      </div>
    );
  }
};

export default NewsSection;
