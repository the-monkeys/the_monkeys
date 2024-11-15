import React, { FC } from 'react';

import { NewsSource2 } from '@/services/news/newsTypes';

export const Source2Card: FC<NewsSource2> = React.memo((props) => {
  const { source, author, title, description, urlToImage } = props;

  return (
    <div className='group col-span-2 sm:col-span-1'>
      <div className='bg-secondary-lightGrey/10 overflow-hidden'>
        <img
          src={urlToImage}
          alt={`${author}/${source.id}`}
          className='h-[200px] w-full object-cover group-hover:opacity-75 transition-transform'
          loading='lazy'
        />
      </div>

      <p className='mt-2 mb-1 font-jost text-xs sm:text-sm opacity-75'>
        {source.name} | {author}
      </p>

      <h2 className='font-josefin_Sans font-medium text-lg line-clamp-2'>
        {title}
      </h2>

      <p className='show sm:hidden font-jost font-light line-clamp-3 opacity-75'>
        {description}
      </p>
    </div>
  );
});
