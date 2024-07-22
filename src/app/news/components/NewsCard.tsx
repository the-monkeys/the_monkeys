import { FC } from 'react';

import Link from 'next/link';

import { NewsSource2 } from '@/services/news/newsTypes';
import { newsDateFormatter } from '@/utils/dateFormatter';

const NewsCard: FC<NewsSource2> = (props) => {
  const {
    source,
    author,
    title,
    description,
    url,
    urlToImage,
    publishedAt,
    content,
  } = props;

  return (
    <div className='group col-span-2 md:col-span-1 md:p-6'>
      <Link
        target='_blank'
        href={url || '#'}
        className='group flex flex-col sm:flex-row md:flex-col gap-4'
      >
        <div className='relative group-hover:opacity-80'>
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

        <div className='flex-1 space-y-1'>
          <p className='font-jost text-sm'>
            {author} - {source?.name}
          </p>

          <h2 className='font-playfair_Display font-medium text-xl sm:text-2xl leading-tight line-clamp-2'>
            {title}
          </h2>

          <p className='font-jost text-sm sm:text-base text-secondary-darkGrey dark:text-secondary-white leading-tight line-clamp-2'>
            {description}
          </p>

          <p className='pt-2 font-jost text-xs text-right'>
            {newsDateFormatter(publishedAt)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
