import { FC } from 'react';

import Link from 'next/link';

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
              className='w-full sm:w-52 md:w-full h-40 sm:h-full md:h-52 object-cover'
              loading='lazy'
            />
          </div>
        )}

        <p className='font-jost text-sm text-right truncate'>
          {newsDateFormatter(published_at)}
          {' | '}
          {source}
        </p>

        <h2 className='mt-1 font-josefin_Sans font-medium text-xl sm:text-2xl leading-tight line-clamp-2 group-hover:underline'>
          {title}
        </h2>

        <p
          dangerouslySetInnerHTML={{ __html: purifyHTMLString(description) }}
          className='mt-1 font-jost text-sm sm:text-base leading-tight line-clamp-2 opacity-75'
        >
          {/* {description} */}
        </p>

        <p className='mt-2 font-josefin_Sans text-xs sm:text-sm text-primary-monkeyOrange'>
          &#35;{category}
        </p>
      </Link>
    </div>
  );
};

export default News1Card;
