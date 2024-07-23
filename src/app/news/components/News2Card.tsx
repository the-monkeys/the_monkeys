import { FC } from 'react';

import Link from 'next/link';

import { NewsSource2 } from '@/services/news/newsTypes';
import { newsDateFormatter } from '@/utils/dateFormatter';

const News2Card: FC<NewsSource2> = (props) => {
  const { source, author, title, description, url, urlToImage, publishedAt } =
    props;

  return (
    <div className='group col-span-2 md:col-span-1 pb-2 md:p-6 border-b-1 border-secondary-lightGrey/25 sm:border-none'>
      <Link target='_blank' href={url || '#'} className='group'>
        <div className='mb-4 relative group-hover:opacity-80'>
          <img
            src={urlToImage || ''}
            alt={title}
            className='w-full sm:w-52 md:w-full h-40 sm:h-full md:h-52 object-cover'
            loading='lazy'
          />

          <p className='absolute bottom-0 right-0 p-1 font-jost text-xs drop-shadow-sm text-secondary-lightGrey/75'>
            source/{source?.id}
          </p>
        </div>

        <p className='font-jost text-sm'>
          {author} - {source?.name}
        </p>

        <h2 className='mt-1 font-playfair_Display font-medium text-xl sm:text-2xl leading-tight line-clamp-2 group-hover:underline'>
          {title}
        </h2>

        <p className='mt-1 font-jost text-sm sm:text-base text-secondary-darkGrey dark:text-secondary-white leading-tight line-clamp-2'>
          {description}
        </p>

        <p className='mt-2 font-jost text-xs text-right'>
          {newsDateFormatter(publishedAt)}
        </p>
      </Link>
    </div>
  );
};

export default News2Card;
