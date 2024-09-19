'use client';

import { Loader } from '@/components/loader';
import { useGetTopHeadlines } from '@/hooks/useGetAllNews';
import { NewsSource3 } from '@/services/news/newsTypes';

const TopNews = () => {
  const { topHeadlines, isLoading, error } = useGetTopHeadlines();

  const newsData = topHeadlines as NewsSource3;

  if (isLoading)
    return (
      <div className='mt-4 space-y-2'>
        <Loader className='mx-auto' />

        <p className='font-jost text-sm text-center'>
          Fetching latest headlines
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
      <div className='bg-white p-4 shadow-sm max-w-md mx-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-red-600 font-bold text-lg'>Latest</h2>
          <button className='bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded'>
            All categories
          </button>
        </div>
        {newsData &&
          newsData.slice(0, 15).map((newsItem: any, index: number) => (
            <div key={index}>
              <ul>
                <li className='flex justify-between py-2 border-b last:border-none'>
                  <span className='text-gray-500 text-sm pr-3'>
                    {index + 1}
                  </span>
                  <a
                    href='#'
                    className='text-gray-800 hover:text-red-600 transition'
                  >
                    {newsItem}
                  </a>
                </li>
              </ul>
            </div>
          ))}{' '}
        <div className='text-right mt-4'>
          <a href='#' className='text-gray-600 hover:text-red-600 transition'>
            See all latest &gt;
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopNews;
