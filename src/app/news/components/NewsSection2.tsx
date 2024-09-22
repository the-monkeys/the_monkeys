'use client';

import Link from 'next/link';

import { NewsSectionSkeleton } from '@/components/skeletons/newsSkeleton';
import { useGetAllNews2 } from '@/hooks/useGetAllNews';
import { NewsSource2 } from '@/services/news/newsTypes';

import Section1 from './news/Section1';

// for news source 2
// import News2Card from './News2Card';

const NewsSection = () => {
  // for news source 1
  //   const { news, isLoading, error } = useGetAllNews1();

  // for news source 2
  const { news, isLoading, error } = useGetAllNews2();

  // for news source 1
  //   const newsData = news?.data as NewsSource1[];

  // for news source 2
  const newsData = news?.articles as NewsSource2[];

  if (isLoading) return <NewsSectionSkeleton />;

  if (error)
    return (
      <p className='pb-4 font-jost text-sm text-alert-red text-center'>
        Error fetching news. Try again.
      </p>
    );

  if (newsData.length >= 20) {
    return (
      <div>
        <div className='max-w-7xl mx-auto p-4 pl-0 '>
          <div className='grid md:grid-cols-3 gap-4'>
            <div className='md:col-span-2'>
              <Link href={newsData[0].url} target='_blank'>
                <img
                  src={newsData[0].urlToImage}
                  alt='Skyscrapers and escalator'
                  className='w-full h-64 object-cover mb-4'
                />
                <h2 className='text-2xl font-bold mb-2'>
                  {newsData[0].author}
                </h2>
                <h1 className='md:text-4xl font-bold mb-2 text-2xl font-josefin_Sans'>
                  {newsData[0].title}
                </h1>
              </Link>
              <p className='dark:text-white py-2 font-jost'>
                {newsData[0].description}...
              </p>
            </div>

            {/* Side Articles */}
            <div className='space-y-4'>
              <div>
                {' '}
                <Link href={newsData[1].url} target='_blank'>
                  <img
                    src={newsData[1].urlToImage}
                    alt='Police car in China'
                    className='w-full h-40 object-cover mb-2'
                  />
                  <h3 className='font-bold mb-1 font-jost'>
                    {newsData[1].title}
                  </h3>
                </Link>
              </div>
              <hr className=' my-4' />
              <div>
                <Link href={newsData[2].url} target='_blank'>
                  <h3 className='font-bold mb-1 font-jost'>
                    {newsData[2].title}
                  </h3>
                </Link>
              </div>
              <hr className=' my-4' />
              <div>
                <Link href={newsData[3].url} target='_blank'>
                  <h3 className='font-bold font-jost'>{newsData[3].title}</h3>
                </Link>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-10 md:flex-row'>
            <Section1
              url={newsData[15].url}
              urlToImage={newsData[15].urlToImage}
              title={newsData[15].title}
            />
            <Section1
              url={newsData[16].url}
              urlToImage={newsData[16].urlToImage}
              title={newsData[16].title}
            />
          </div>
          <div className='py-5 flex md:flex-row overflow-hidden  max-w-full w-full'>
            <div className='w-full  hidden md:block'>
              {' '}
              <Link href={newsData[4].url} target='_blank'>
                <img
                  src={newsData[4].urlToImage}
                  alt='Market news'
                  className='object-cover h-full w-full'
                />
              </Link>
            </div>

            <div className='w-full md:p-4'>
              <Link href={newsData[4].url} target='_blank'>
                <h2 className='text-xl font-semibold font-josefin_Sans'>
                  {newsData[4].title}
                </h2>
              </Link>

              {/* Related Section */}
              <div className='mt-4 rounded-lg md:p-2'>
                <h5 className='text-sm font-semibold text-secondary-lightGrey'>
                  Related
                </h5>{' '}
                <ul className='mt-2 space-y-1'>
                  <Link href={newsData[5].url} target='_blank'>
                    <li className=' hover:underline cursor-pointer font-jost'>
                      {newsData[5].title}
                    </li>
                  </Link>
                  <hr className=' my-2' />
                  <Link href={newsData[7].url} target='_blank'>
                    <li className=' hover:underline cursor-pointer font-jost '>
                      {newsData[7].title}
                    </li>
                  </Link>
                  <hr className=' my-2' />
                  <Link href={newsData[8].url} target='_blank'>
                    <li className=' hover:underline cursor-pointer font-jost'>
                      {newsData[8].title}
                    </li>
                  </Link>
                  <hr className=' my-2' />
                  <Link href={newsData[9].url} target='_blank'>
                    <li className=' hover:underline cursor-pointer font-jost'>
                      {newsData[9].title}
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>{' '}
          <div className='flex'>
            <Link href={newsData[19].url} target='_blank'>
              <div className=''>
                <img
                  src={newsData[19].urlToImage}
                  alt='Sri Lanka Restructuring Deal'
                  className='w-full h-auto'
                />
                <h2 className='text-xl md:text-2xl font-bold mt-2 font-josefin_Sans'>
                  {newsData[19].title}
                </h2>
                <p className='text-xs text-secondary-lightGrey mt-2'>
                  about 3 hours ago
                </p>
                <div className=' rounded-md mt-4'>
                  <p className='text-sm dark:text-white font-jost'>
                    {newsData[19].description}
                  </p>
                </div>
              </div>
            </Link>
            <Link href={newsData[25].url} target='_blank'>
              <div className='pl-4'>
                <img
                  src={newsData[25].urlToImage}
                  alt='Sri Lanka Restructuring Deal'
                  className='w-full h-auto'
                />
                <h2 className='text-xl md:text-2xl font-bold mt-2 font-josefin_Sans'>
                  {newsData[25].title}
                </h2>
                <p className='text-xs text-secondary-lightGrey mt-2'>
                  about 3 hours ago
                </p>
                <div className=' rounded-md mt-4'>
                  <p className='text-sm dark:text-white font-jos text-black'>
                    {newsData[25].description}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default NewsSection;
