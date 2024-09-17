import { FC } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { NewsSource1 } from '@/services/news/newsTypes';
import { newsDateFormatter } from '@/utils/dateFormatter';
import { purifyHTMLString } from '@/utils/purifyHTML';
import { twMerge } from 'tailwind-merge';

const News1Card: FC<NewsSource1> = (props) => {
  const {
    author,
    title,
    description,
    url,
    source,
    image,
    category,
    published_at,
  } = props;

  return (
    <div
      className={twMerge(
        'group col-span-2 md:col-span-1 md:p-6 pb-2 border-b-1 border-secondary-lightGrey/25 sm:border-none',
        !image && 'sm:flex flex-col justify-center'
      )}
    >
      <Link target='_blank' href={url || '#'} className='group'>
        {image && (
          <div className='mb-4 group-hover:opacity-80'>
            <img
              src={image || ''}
              alt={title}
              className='w-full md:w-full h-40 md:h-52 object-cover'
              loading='lazy'
            />
          </div>
        )}

        <div className='flex justify-between align-center'>
          <p className='font-josefin_Sans text-sm truncate opacity-75'>
            {source}
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

        <h2 className='mt-1 font-josefin_Sans font-medium text-xl sm:text-2xl leading-tight line-clamp-2 group-hover:opacity-80'>
          {title}
        </h2>

        <p
          dangerouslySetInnerHTML={{ __html: purifyHTMLString(description) }}
          className='mt-1 font-jost text-sm sm:text-base leading-tight line-clamp-2 opacity-75'
        ></p>

        <div className='mt-2 flex justify-between'>
          <Badge
            variant='secondary'
            className='font-jost text-xs sm:text-sm capitalize '
          >
            {category}
          </Badge>

          <p className='font-jost text-xs sm:text-sm'>
            {newsDateFormatter(published_at)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default News1Card;
