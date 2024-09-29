import React, { FC } from 'react';

import Link from 'next/link';

import { NewsSource2 } from '@/services/news/newsTypes';

const Source2Card: FC<NewsSource2> = (props) => {
  const { source, author, title, description, urlToImage, url } = props;

  return (
    <Link href={url} className='group col-span-2 sm:col-span-1'>
      <div className='bg-secondary-lightGrey/10 overflow-hidden'>
        <img
          src={urlToImage}
          alt={`${author}/${source.id}`}
          className='h-[200px] w-full object-cover group-hover:opacity-75 transition-transform'
          loading='lazy'
        />
      </div>

      <p className='mt-1 mb-2 font-jost text-xs sm:text-sm opacity-75'>
        {source.name} | {author}
      </p>

      <h2 className='font-josefin_Sans font-medium text-lg line-clamp-2'>
        {title}
      </h2>

      <p className='show sm:hidden font-jost font-light line-clamp-3 opacity-75'>
        {description}
      </p>
    </Link>
  );
};

export default React.memo(Source2Card);
