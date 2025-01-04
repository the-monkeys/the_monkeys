import React, { FC } from 'react';

import { NewsSource2 } from '@/services/news/newsTypes';

export const NewsGridCard: FC<NewsSource2> = React.memo((props) => {
  const { source, author, title, description, urlToImage } = props;

  return (
    <div className='col-span-2 sm:col-span-1 space-y-3'>
      <div className='w-full h-40 bg-foreground-light dark:bg-foreground-dark rounded-lg overflow-hidden'>
        <img
          src={urlToImage}
          className='h-full w-full object-cover'
          loading='lazy'
        />
      </div>

      <div className='space-y-1'>
        <p className='font-dm_sans text-xs'>{`${source.name} | ${author}`}</p>

        <h2 className='font-medium text-lg line-clamp-3'>{title}</h2>

        <p className='text-sm line-clamp-2 opacity-80'>{description}</p>
      </div>
    </div>
  );
});
NewsGridCard.displayName = 'NewsGridCard';
