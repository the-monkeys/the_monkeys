import React, { FC } from 'react';

import { NewsSource1 } from '@/services/news/newsTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';
import moment from 'moment';

export const NewsCategoryCard: FC<NewsSource1> = React.memo((props) => {
  const { source, title, published_at, image } = props;

  return (
    <div className='p-4 bg-foreground-light/25 dark:bg-foreground-dark/25 space-y-2 rounded-md'>
      <p className='text-sm opacity-80 truncate'>{source}</p>

      <div className='flex gap-3'>
        <div className='flex-1 space-y-2'>
          <h4
            dangerouslySetInnerHTML={{
              __html: purifyHTMLString(title),
            }}
            className='font-medium'
          ></h4>

          <p className='w-fit font-dm_sans text-xs opacity-80'>
            {moment(published_at).fromNow()}
          </p>
        </div>

        {image && (
          <div className='hidden sm:block size-20 rounded-lg overflow-hidden'>
            <img
              src={image}
              alt={source}
              className='h-full w-full object-cover'
            />
          </div>
        )}
      </div>
    </div>
  );
});
NewsCategoryCard.displayName = 'NewsCategoryCard';
