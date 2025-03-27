import React, { FC } from 'react';

import { NewsSource2 } from '@/services/news/newsTypes';

export const NewsGridCard: FC<NewsSource2> = React.memo((props) => {
  const { source, author, title, urlToImage } = props;

  return (
    <div className='relative group h-[220px] sm:h-[250px] col-span-2 sm:col-span-1 flex flex-col justify-end overflow-hidden'>
      <div className='absolute top-0 left-0 w-full h-full bg-foreground-light dark:bg-foreground-dark'>
        <img
          src={urlToImage || ''}
          alt={title}
          className='h-full w-full object-cover'
          loading='lazy'
        />
      </div>

      <div className='p-3 space-y-1 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10'>
        <p className='font-dm_sans text-xs'>{`${source.name} | ${author}`}</p>

        <h2 className='font-medium line-clamp-2'>{title}</h2>
      </div>
    </div>
  );
});
NewsGridCard.displayName = 'NewsGridCard';
