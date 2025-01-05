import React, { FC } from 'react';

import { NewsSource1 } from '@/services/news/newsTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';
import moment from 'moment';

export const NewsCategoryCard: FC<NewsSource1> = React.memo((props) => {
  const { source, title, published_at, image } = props;

  return (
    <div className='p-4 bg-foreground-light/25 dark:bg-foreground-dark/25 space-y-2 rounded-md'>
      <div className='space-y-2'>
        {image && image.endsWith('.mp4') && (
          <div className='w-full rounded-md overflow-hidden'>
            <video
              src={image}
              autoPlay
              controls
              controlsList='nodownload'
              muted
              className='h-full w-full object-cover'
              aria-label='News video'
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className='flex flex-col gap-1'>
          <p className='text-sm font-medium opacity-80'>{source}</p>

          <h4
            dangerouslySetInnerHTML={{
              __html: purifyHTMLString(title),
            }}
            className='font-medium'
          ></h4>

          <p className='self-end font-dm_sans text-xs opacity-80'>
            {`- ${moment(published_at).fromNow()}`}
          </p>
        </div>
      </div>
    </div>
  );
});
NewsCategoryCard.displayName = 'NewsCategoryCard';
