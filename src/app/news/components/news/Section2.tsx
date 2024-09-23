import React from 'react';

import Link from 'next/link';

import { NewsSource2 } from '@/services/news/newsTypes';

interface NewsCarouselProps {
  newsArray: NewsSource2[];
}
const Section2 = ({ newsArray }: NewsCarouselProps) => {
  return (
    <div>
      <Link href={newsArray[2].url} target='_blank'>
        <div className='container mx-auto p-4'>
          {/* Main Content */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
            {' '}
            <div className='relative'>
              <img
                src={newsArray[2].urlToImage}
                alt='Video Thumbnail'
                className='w-full h-auto rounded'
              />
              <div className='absolute bottom-2 left-2 bg-black text-white text-xs px-2 py-1 rounded'>
                6:00
              </div>
            </div>
            <div>
              <h2 className='text-xl md:text-2xl font-bold font-josefin_Sans'>
                {newsArray[2].title}
              </h2>
              <div className='space-y-2 mt-4'>
                <p className=' hover:underline cursor-pointer font-jost'>
                  {newsArray[2].description.slice(0, 300)}...
                </p>
              </div>
            </div>
          </div>
        </div>{' '}
      </Link>
    </div>
  );
};

export default Section2;
