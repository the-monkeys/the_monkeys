import { FC } from 'react';

import Link from 'next/link';

import { NewsItem } from '@/lib/types';
import { newsDateFormatter } from '@/utils/dateFormatter';
import { twMerge } from 'tailwind-merge';

const NewsTitle = ({ title }: { title: string }) => (
  <h2 className='font-playfair_Display font-medium text-xl sm:text-2xl leading-tight group-hover:underline group-hover:underline-offset-4'>
    {title}
  </h2>
);

const NewsCard: FC<NewsItem> = (props) => {
  const { title, description, image, source, url, published_at } = props;

  if (title === description) {
    return (
      <div className='col-span-2 mx-auto my-2 w-full sm:w-4/5 p-4 border-1 border-secondary-lightGrey/25'>
        <Link
          target='_blank'
          href={`/news/read?url=${url}`}
          className='group space-y-4'
        >
          <NewsTitle title={title} />

          <div className='mt-1 flex items-center space-x-2 font-jost text-xs text-secondary-darkGrey dark:text-secondary-white'>
            <p>{source}</p>
            <p>|</p>
            <p>{newsDateFormatter(published_at)}</p>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        'px-0 py-4 md:p-6 space-y-4',
        image ? 'col-span-2 md:col-span-1' : 'col-span-2'
      )}
    >
      {image && (
        <Link
          target='_blank'
          href={`/news/read?url=${url}`}
          className='w-fit hover:opacity-75'
        >
          <img src={image || ''} alt={title} className='object-contain' />
        </Link>
      )}

      <div>
        <Link
          target='_blank'
          href={`/news/read?url=${url}`}
          className='group space-y-4'
        >
          <NewsTitle title={title} />

          <p className='font-jost text-sm sm:text-base text-secondary-darkGrey dark:text-secondary-white leading-tight line-clamp-2'>
            {description}
          </p>

          <div className='w-fit flex items-center space-x-2 font-jost text-xs'>
            <p>{source}</p>
            <p>|</p>
            <p>{newsDateFormatter(published_at)}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
