'use client';

import { useGetAllNews2 } from '@/hooks/useGetAllNews';
import { NewsSource2 } from '@/services/news/newsTypes';

import Section1 from './Section1';
import Section2 from './Section2';

const FooterSection = () => {
  const { news, isLoading, error } = useGetAllNews2();
  const newsData = news?.articles as NewsSource2[];
  if (newsData) {
    return (
      <div className='dark:border-gray-600 border pb-2'>
        <div className='container mx-auto p-4'>
          {/* Tag Section */}
          <div className='flex space-x-4 text-sm text-gray-600'>
            <span className='font-bold'>{newsData[8]?.source.name}</span>
            <span>{newsData[9]?.source.name}</span>
          </div>

          {/* Main Content */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
            <div>
              <h2 className='text-xl md:text-2xl font-bold'>
                {newsData[12].title}
              </h2>
              <div className='space-y-2 mt-4'>
                <p className='text-gray-600 hover:underline cursor-pointer py-3'>
                  {newsData[12].description.slice(0, 500)}...
                </p>

                <p className='text-gray-600 hover:underline cursor-pointer'>
                  {newsData[12].content.slice(0, 200)}...
                </p>
              </div>
            </div>
            <div className='relative'>
              <img
                src={newsData[12].urlToImage}
                alt='Video Thumbnail'
                className='w-full h-auto rounded'
              />
              <div className='absolute bottom-2 left-2 bg-black text-white text-xs px-2 py-1 rounded'>
                6:00
              </div>
            </div>
          </div>
        </div>
        <hr className='border-t border-gray-300 my-4' />
        <div className='container mx-auto p-4'>
          {/* Main Content */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Left Article */}
            <div className='border-b md:border-b-0 md:border-r pr-4'>
              <img
                src={newsData[13].urlToImage}
                alt='Apple EU Warning'
                className='w-full h-auto'
              />
              <p className='text-xs mt-1 text-gray-500'>
                {newsData[13].source.name}
              </p>
              <h3 className='text-red-600 font-bold mt-2'>EXCLUSIVE</h3>
              <h2 className='text-xl md:text-2xl font-bold mt-2'>
                {newsData[13].title}
              </h2>
              <div className='border rounded-md mt-4 p-2 bg-gray-100'>
                <p className='text-sm font-bold dark:text-black'>ANALYSIS</p>
                <p className='text-sm dark:text-black'>
                  {newsData[13].description}
                </p>
              </div>
            </div>

            <div className='pl-4'>
              <img
                src={newsData[14].urlToImage}
                alt='Sri Lanka Restructuring Deal'
                className='w-full h-auto'
              />
              <h2 className='text-xl md:text-2xl font-bold mt-2'>
                {newsData[14].title}
              </h2>
              <p className='text-xs text-gray-500 mt-2'>about 3 hours ago</p>
              <div className='border rounded-md mt-4 p-2 bg-gray-100'>
                <p className='text-sm dark:text-black'>
                  {newsData[14].description}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4'>
          <Section1
            urlToImage={newsData[15].urlToImage}
            title={newsData[15].title}
          />

          <Section1
            urlToImage={newsData[16].urlToImage}
            title={newsData[16].title}
          />

          <Section1
            urlToImage={newsData[17].urlToImage}
            title={newsData[17].title}
          />

          <Section1
            urlToImage={newsData[18].urlToImage}
            title={newsData[18].title}
          />
        </div>
        <Section2
          newsArray={[newsData[19], newsData[20], newsData[21], newsData[24]]}
        />{' '}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Left Article */}
          <div className='border-b md:border-b-0 md:border-r pr-4'>
            <div className='pl-4'>
              <img
                src={newsData[25].urlToImage}
                alt='Sri Lanka Restructuring Deal'
                className='w-full h-auto'
              />
              <h2 className='text-xl md:text-2xl font-bold mt-2'>
                {newsData[25].title}
              </h2>
              <p className='text-xs text-gray-500 mt-2'>about 3 hours ago</p>
              <div className='border rounded-md mt-4 p-2 bg-gray-100'>
                <p className='text-sm dark:text-black'>
                  {newsData[25].description.slice(0, 300)}...
                </p>
              </div>
            </div>
          </div>
          <div className='pr-4'>
            <div className='pl-4'>
              <img
                src={newsData[26].urlToImage}
                alt='Sri Lanka Restructuring Deal'
                className='w-full h-auto'
              />
              <h2 className='text-xl md:text-2xl font-bold mt-2'>
                {newsData[26].title}
              </h2>
              <p className='text-xs text-gray-500 mt-2'>about 3 hours ago</p>
              <div className='border rounded-md mt-4 p-2 bg-gray-100'>
                <p className='text-sm dark:text-black'>
                  {newsData[26].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default FooterSection;
