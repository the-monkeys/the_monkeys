import { useState } from 'react';

import { NewsCategoryCard } from '@/components/news/cards/CategoryCard';
import { NewsCategoriesSkeleton } from '@/components/skeletons/newsSkeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetAllNews1 } from '@/hooks/blog/useGetAllNews';
import { NewsSource1 } from '@/services/news/newsTypes';

type CategoryItems = NewsSource1[] | [];

export const NewsCategories = () => {
  const { news, isLoading, error } = useGetAllNews1();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(10);

  const newsData = (news?.data as NewsSource1[]) || [];

  if (isLoading) return <NewsCategoriesSkeleton />;

  if (error)
    return (
      <div className='py-4 min-h-screen'>
        <p className='w-full text-sm opacity-80 text-center'>
          Unable to fetch content. Please try again later.
        </p>
      </div>
    );

  const sportsTitles = new Set();
  const businessTitles = new Set();
  const scienceTitles = new Set();
  const entertainmentTitles = new Set();

  const sportsNews: NewsSource1[] = [];
  const businessNews: NewsSource1[] = [];
  const scienceNews: NewsSource1[] = [];
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
      case 'science':
        if (!scienceTitles.has(item.title)) {
          scienceTitles.add(item.title);
          scienceNews.push(item);
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

  const categoryMap = new Map<string, CategoryItems>([
    [
      'all',
      [...sportsNews, ...businessNews, ...scienceNews, ...entertainmentNews],
    ],
    ['sports', sportsNews],
    ['business', businessNews],
    ['science', scienceNews],
    ['entertainment', entertainmentNews],
  ]);

  const filteredNews: CategoryItems = categoryMap.get(selectedCategory) || [];

  const handleLoadMoreNews = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  return (
    <div className='space-y-3'>
      <Select onValueChange={(value) => setSelectedCategory(value)}>
        <div className='flex justify-between items-center gap-3'>
          <h4 className='px-1 font-dm_sans font-medium text-xl'>Latest</h4>

          <SelectTrigger className='px-4 w-[180px] rounded-full'>
            <SelectValue placeholder='Category' />
          </SelectTrigger>
        </div>

        <SelectContent>
          <SelectItem value='all'>All</SelectItem>
          {sportsNews.length > 0 && (
            <SelectItem value='sports'>Sports</SelectItem>
          )}
          {businessNews.length > 0 && (
            <SelectItem value='business'>Business</SelectItem>
          )}
          {scienceNews.length > 0 && (
            <SelectItem value='science'>Science</SelectItem>
          )}
          {entertainmentNews.length > 0 && (
            <SelectItem value='entertainment'>Entertainment</SelectItem>
          )}
        </SelectContent>
      </Select>

      <div className='divide-y-2 divide-background-light dark:divide-background-dark'>
        {filteredNews.length > 0 ? (
          <>
            {filteredNews.slice(0, visibleCount).map((newsItem, index) => (
              <NewsCategoryCard
                key={`${newsItem.published_at}_${newsItem.source}`}
                {...newsItem}
              />
            ))}

            <div className='py-4 col-span-2 sm:col-span-1 flex items-center justify-center'>
              {filteredNews.length > visibleCount && (
                <button
                  className='font-dm_sans text-sm opacity-80 hover:opacity-100'
                  onClick={handleLoadMoreNews}
                >
                  Show more
                </button>
              )}
            </div>
          </>
        ) : (
          <p className='text-sm opacity-60'>
            No news available in this category.
          </p>
        )}
      </div>
    </div>
  );
};
