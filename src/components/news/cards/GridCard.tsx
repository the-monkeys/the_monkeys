import React, { FC } from 'react';

import { NewsSource2 } from '@/services/news/newsTypes';

export const NewsGridCard: FC<NewsSource2> = React.memo((props) => {
  const { source, author, title, urlToImage } = props;

  return (
    <div className='relative group h-[250px] sm:h-[280px] col-span-2 sm:col-span-1 flex flex-col justify-end rounded-md overflow-hidden'>
      <div className='absolute top-0 left-0 w-full h-full bg-foreground-light dark:bg-foreground-dark rounded-lg overflow-hidden'>
        <img
          src={urlToImage || ''}
          alt={title}
          className='h-full w-full object-cover'
          loading='lazy'
        />
      </div>

      <div className='px-2 py-4 space-y-1 bg-background-dark/50 dark:bg-background-light/50 text-text-dark dark:text-text-light group-hover:backdrop-blur-md z-10 transition-all cursor-default'>
        <p className='font-medium text-sm opacity-80'>{`${source.name} | ${author}`}</p>

        <h2 className='font-semibold text-lg line-clamp-2'>{title}</h2>
      </div>
    </div>
  );
});
NewsGridCard.displayName = 'NewsGridCard';
