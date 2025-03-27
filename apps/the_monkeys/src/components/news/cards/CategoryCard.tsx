import React, { FC } from 'react';

import { NewsSource1 } from '@/services/news/newsTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';
import moment from 'moment';

export const NewsCategoryCard: FC<NewsSource1> = React.memo((props) => {
  const { category, source, title, published_at, image } = props;

  return (
    <div className='p-3 bg-foreground-light/25 dark:bg-foreground-dark/25 space-y-1'>
      <p className='font-dm_sans text-sm opacity-80 line-clamp-1'>{source}</p>

      <div className='h-[60px] sm:h-[80px] flex gap-2'>
        <div className='flex-1 space-y-1'>
          <h1
            dangerouslySetInnerHTML={{
              __html: purifyHTMLString(title),
            }}
            className='font-medium text-base line-clamp-2'
          ></h1>
        </div>

        {image && !image.endsWith('.mp4') && (
          <div className='size-16 rounded-lg overflow-hidden'>
            <img src={image} className='w-full h-full object-cover' />
          </div>
        )}
      </div>

      <div className='flex items-center gap-1'>
        <p className='text-xs sm:text-sm'>{moment(published_at).fromNow()}</p>
        <span className='text-sm'>·</span>
        <p className='text-xs sm:text-sm capitalize'>{category}</p>
      </div>
    </div>
  );
});
NewsCategoryCard.displayName = 'NewsCategoryCard';
