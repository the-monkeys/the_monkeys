import { FC } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import { NewsSource2 } from '@/services/news/newsTypes';
import { newsDateFormatter } from '@/utils/dateFormatter';

const News2Card: FC<NewsSource2> = (props) => {
  const { source, author, title, description, url, urlToImage, publishedAt } =
    props;

  return (
    <div className='group col-span-2 md:col-span-1 pb-2 md:p-6 border border-b-1 border-secondary-lightGrey/25 sm:border-none'>
      <Link target='_blank' href={url || '#'} className='group'>
        <div className='mb-4 relative group-hover:opacity-80'>
          <img
            src={urlToImage || ''}
            alt={title}
            className='w-full sm:w-52 md:w-full h-40 sm:h-full md:h-52 object-cover'
            loading='lazy'
          />

          <div className='flex justify-between align-center pt-3'>
            {' '}
            <p className='font-jost text-sm'>
              {author} - {source?.name}
            </p>
            <div className='flex justify-center items-center opacity-60'>
              <Icon
                name='RiTime'
                size={16}
                className='mx-2 transition-all group-hover:ml-3 group-hover:mr-1 '
              />{' '}
              {Math.ceil(description.length / 100) + ' min'}
            </div>
          </div>
        </div>
        <h2 className='mt-1 font-playfair_Display font-medium text-xl sm:text-2xl leading-tight line-clamp-2 group-hover:opacity-80'>
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
