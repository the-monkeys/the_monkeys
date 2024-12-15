import React, { FC } from 'react';

import Link from 'next/link';

import { NewsSource2 } from '@/services/news/newsTypes';

export const Source2Card: FC<NewsSource2> = React.memo((props) => {
  const { source, author, title, description, url, urlToImage } = props;

  return (
    <div className='flex flex-col sm:flex-row gap-2 sm:gap-[10px] col-span-2 sm:col-span-1'>
      <div className='w-full sm:w-28 h-36 sm:h-28 bg-foreground-light dark:bg-foreground-dark rounded-lg overflow-hidden'>
        <img
          src={urlToImage}
          alt={`${author}/${source.id}`}
          className='h-full w-full object-cover'
          loading='lazy'
        />
      </div>

      <Link href={url} target='_blank' className='flex-1 group'>
        <p className='mb-1 font-dm_sans font-medium text-xs'>
          {`${source.name} | ${author}`}
        </p>

        <h2 className='font-roboto font-medium text-base sm:text-lg line-clamp-2 group-hover:underline underline-offset-2 decoration-1'>
          {title}
        </h2>

        <p className='font-roboto text-sm opacity-80 line-clamp-1'>
          {description}
        </p>
      </Link>
    </div>
  );
});
