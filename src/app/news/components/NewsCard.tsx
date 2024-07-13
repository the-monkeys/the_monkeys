import { FC } from 'react';

import Link from 'next/link';

import { NewsItem } from '@/lib/types';
import moment from 'moment';

const NewsCard: FC<NewsItem> = (props) => {
  const { title, description, image, source, url, published_at } = props;

  const formattedDate = moment(published_at).format('MMMM DD, YYYY');
  const timeAgo = moment(published_at).fromNow();

  if (title === description)
    return (
      <div className='mx-auto h-fit w-fit my-2 p-4'>
        <p className='w-fit mb-1 font-jost text-xs opacity-75 cursor-default'>
          Source: {source}
        </p>

        <Link href={url} className='hover:opacity-75'>
          <h1 className='font-josefin_Sans font-medium text-2xl leading-tight'>
            {title}
          </h1>
        </Link>

        <p className='mt-2 font-jost text-xs opacity-75 text-right cursor-default'>
          {formattedDate} | {timeAgo}
        </p>
      </div>
    );

  return (
    <div className='w-full px-0 md:px-4 py-4 md:py-6 flex flex-col sm:flex-row flex-wrap gap-4'>
      {image && (
        <Link href={url} className='hover:opacity-75'>
          <img
            alt={source}
            src={image || ''}
            className='w-full h-full object-cover'
          />
        </Link>
      )}

      <Link href={url} className='flex-1 group'>
        <p className='w-fit mb-1 font-jost text-xs opacity-75 cursor-default'>
          Source: {source}
        </p>

        <h1 className='font-josefin_Sans text-2xl group-hover:opacity-75 leading-tight'>
          {title}
        </h1>

        <p className='font-jost text-justified line-clamp-2'>{description}</p>

        <p className='mt-2 font-jost text-xs opacity-75 text-right cursor-default'>
          {formattedDate} | {timeAgo}
        </p>
      </Link>
    </div>
  );
};

export default NewsCard;
