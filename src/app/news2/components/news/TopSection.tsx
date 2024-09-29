'use client';

import Link from 'next/link';

import { useGetAllNews2 } from '@/hooks/useGetAllNews';
import { NewsSource2 } from '@/services/news/newsTypes';

import Section1 from './Section1';
import Section2 from './Section2';

const FooterSection = () => {
  const { news, isLoading, error } = useGetAllNews2();
  const newsData = news?.articles as NewsSource2[];
  if (newsData && newsData.length >= 30) {
    return (
      <div className='pb-2 dark:text-white'>
        <div className='container mx-auto p-4'>
          {/* Main Content */}
          <Link href={newsData[12].url} target='_blank'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
              <div>
                <h2 className='text-xl md:text-2xl font-josefin_Sans font-bold'>
                  {newsData[12].title}
                </h2>
                <div className='space-y-2 mt-4'>
                  <p className='dark:text-white cursor-pointer font-jost py-3'>
                    {newsData[12].description.slice(0, 500)}...
                  </p>

                  <p className='dark:text-white  cursor-pointer font-jost'>
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
          </Link>
        </div>
        <Link href={newsData[13].url} target='_blank'>
          <div className='container mx-auto p-4'>
            {/* Main Content */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Left Article */}
              <div className=' pr-4'>
                <img
                  src={newsData[13].urlToImage}
                  alt='Apple EU Warning'
                  className='w-full h-auto'
                />

                <h3 className='text-red-600 font-bold mt-2'>EXCLUSIVE</h3>
                <h2 className='text-xl md:text-2xl font-bold mt-2 font-josefin_Sans'>
                  {newsData[13].title}
                </h2>
                <div className=' rounded-md mt-4 p-2'>
                  <p className='text-sm font-bold dark:text-white'>ANALYSIS</p>
                  <p className='text-sm dark:text-white font-jost'>
                    {newsData[13].description}
                  </p>
                </div>
              </div>

              <Link href={newsData[14].url} target='_blank'>
                <div className='pl-4'>
                  <img
                    src={newsData[14].urlToImage}
                    alt='Sri Lanka Restructuring Deal'
                    className='w-full h-auto'
                  />
                  <h2 className='text-xl md:text-2xl font-bold mt-2 font-josefin_Sans-'>
                    {newsData[14].title}
                  </h2>
                  <p className='text-xs text-gray-500 mt-2'>
                    about 3 hours ago
                  </p>
                  <div className=' rounded-md mt-4 p-2'>
                    <p className='text-sm dark:text-white font-jost'>
                      {newsData[14].description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </Link>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4'>
          <Section1
            url={newsData[15].url}
            urlToImage={newsData[15].urlToImage}
            title={newsData[15].title}
          />

          <Section1
            url={newsData[16]?.url}
            urlToImage={newsData[16].urlToImage}
            title={newsData[16].title}
          />

          <Section1
            url={newsData[17]?.url}
            urlToImage={newsData[17].urlToImage}
            title={newsData[17].title}
          />

          <Section1
            url={newsData[18]?.url}
            urlToImage={newsData[18].urlToImage}
            title={newsData[18].title}
          />
        </div>
        <Section2
          newsArray={[newsData[19], newsData[20], newsData[21], newsData[24]]}
        />{' '}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Left Article */}
          <Link href={newsData[26].url} target='_blank'>
            <div className=' pr-4'>
              <div className='pl-4'>
                <img
                  src={newsData[25].urlToImage}
                  alt='Sri Lanka Restructuring Deal'
                  className='w-full h-auto'
                />
                <h2 className='text-xl md:text-2xl font-bold mt-2 font-josefin_Sans'>
                  {newsData[25].title}
                </h2>
                <p className='text-xs mt-2'>about 3 hours ago</p>
                <div className='rounded-md mt-4'>
                  <p className='text-sm dark:text-white font-jost'>
                    {newsData[25].description.slice(0, 300)}...
                  </p>
                </div>
              </div>
            </div>
          </Link>
          <Link href={newsData[26].url} target='_blank'>
            <div className='pr-4'>
              <div className='pl-4'>
                <img
                  src={newsData[26].urlToImage}
                  alt='Sri Lanka Restructuring Deal'
                  className='w-full h-auto'
                />
                <h2 className='text-xl md:text-2xl font-bold mt-2 font-josefin_Sans'>
                  {newsData[26].title}
                </h2>
                <p className='text-xs mt-2'>about 3 hours ago</p>
                <div className=' rounded-md mt-4 '>
                  <p className='text-sm dark:text-white font-jost'>
                    {newsData[26].description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
};

export default FooterSection;
