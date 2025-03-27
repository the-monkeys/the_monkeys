import { useState } from 'react';

import Icon from '@/components/icon';
import { NewsCategoryCard } from '@/components/news/cards/CategoryCard';
import { useGetAllNews1 } from '@/hooks/blog/useGetAllNews';
import { NewsSource1 } from '@/services/news/newsTypes';
import { twMerge } from 'tailwind-merge';

const CategorySection = ({
  heading,
  newsList,
}: {
  heading: string;
  newsList: NewsSource1[];
}) => {
  const [expandStatus, setExapandStatus] = useState<boolean>(true);

  const handleExpandStatus = () => {
    setExapandStatus((prevStatus) => !prevStatus);
  };

  return (
    <div className='col-span-1 space-y-3'>
      <div className='flex justify-between gap-3'>
        <h4 className='px-1 font-dm_sans font-medium'>{heading}</h4>

        <button
          onClick={handleExpandStatus}
          className='block sm:hidden opacity-80 hover:opacity-100'
        >
          <Icon
            name='RiArrowDownS'
            className={twMerge(
              'transition-all',
              expandStatus ? 'rotate-180' : 'rotate-0'
            )}
          />
        </button>
      </div>

      <div
        className={twMerge(
          'sm:block divide-y-4 divide-background-light dark:divide-background-dark',
          expandStatus ? 'block' : 'hidden'
        )}
      >
        {newsList.slice(0, 5).map((newsItem) => (
          <NewsCategoryCard key={newsItem.url} {...newsItem} />
        ))}
      </div>
    </div>
  );
};

export const NewsCategories = () => {
  const { news, isLoading, error } = useGetAllNews1();

  const newsData = (news?.data as NewsSource1[]) || [];

  if (isLoading || error) return null;

  const sportsTitles = new Set();
  const businessTitles = new Set();
  const technologyTitles = new Set();
  const entertainmentTitles = new Set();

  const sportsNews: NewsSource1[] = [];
  const businessNews: NewsSource1[] = [];
  const technologyNews: NewsSource1[] = [];
  const entertainmentNews: NewsSource1[] = [];

  newsData.forEach((item) => {
    if (item.language !== 'en') return;

    switch (item.category) {
      case 'sports':
        if (!sportsTitles.has(item.title)) {
          sportsTitles.add(item.title);
          sportsNews.push(item);
        }
        break;
      case 'business':
        if (!businessTitles.has(item.title)) {
          businessTitles.add(item.title);
          businessNews.push(item);
        }
        break;
      case 'technology':
        if (!technologyTitles.has(item.title)) {
          technologyTitles.add(item.title);
          technologyNews.push(item);
        }
        break;
      case 'entertainment':
        if (!entertainmentTitles.has(item.title)) {
          entertainmentTitles.add(item.title);
          entertainmentNews.push(item);
        }
        break;
    }
  });

  return (
    <div className='mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6'>
      {sportsNews.length > 0 && (
        <CategorySection heading='Sports' newsList={sportsNews} />
      )}

      {businessNews.length > 0 && (
        <CategorySection heading='Business' newsList={businessNews} />
      )}

      {entertainmentNews.length > 0 && (
        <CategorySection heading='Entertainment' newsList={entertainmentNews} />
      )}

      {technologyNews.length > 0 && (
        <CategorySection heading='Technology' newsList={technologyNews} />
      )}
    </div>
  );
};
