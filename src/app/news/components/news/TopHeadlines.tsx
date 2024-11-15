'use client';

import { Loader } from '@/components/loader';
import { Separator } from '@/components/ui/separator';
import { useGetTopHeadlines } from '@/hooks/useGetAllNews';
import { NewsSource3 } from '@/services/news/newsTypes';

export const Headlines = () => {
  const { topHeadlines, isLoading, error } = useGetTopHeadlines();

  const newsData = topHeadlines as NewsSource3;

  if (isLoading)
    return (
      <div className='mt-2 space-y-2'>
        <Loader className='mx-auto' />

        <p className='font-jost text-sm text-center'>
          Fetching latest headlines
        </p>
      </div>
    );

  if (error)
    return (
      <p className='py-4 font-jost text-sm text-alert-red text-center'>
        Error fetching headlines. Try again.
      </p>
    );

  return (
    <div className='divide-y-1 divide-secondary-lightGrey/25'>
      {newsData &&
        newsData.slice(0, 15).map((newsItem, index) => (
          <div key={index} className='p-2 hover:bg-secondary-lightGrey/25'>
            <p className='font-jost cursor-default'>{newsItem}</p>
          </div>
        ))}
    </div>
  );
};

export const TopHeadlines = () => {
  return (
    <div className='sticky top-0 right-0 hidden lg:block lg:p-4 col-span-4 lg:col-span-1'>
      <h3 className='px-1 font-josefin_Sans font-semibold text-xl'>
        Top Headlines
      </h3>

      <p className='px-1 font-jost text-sm opacity-75'>
        Catch the latest headlines in a moment
      </p>

      <Separator className='mt-4 bg-secondary-lightGrey/25' />

      <Headlines />
    </div>
  );
};
