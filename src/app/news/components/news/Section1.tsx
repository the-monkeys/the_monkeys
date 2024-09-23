import React from 'react';

import Link from 'next/link';

const Section1 = ({
  urlToImage,
  url,
  title,
}: {
  urlToImage: string;
  url: string;
  title: string;
}) => {
  return (
    <Link href={url != undefined ? url : ''} target='_blank'>
      <div className='article rounded overflow-hidden shadow-md'>
        <img
          src={urlToImage}
          alt='Article 3'
          className='w-full h-48 object-cover'
        />
        <h2 className='text-lg font-semibold mt-4 px-4 pb-2 dark:text-white font-jost'>
          {title.slice(0, 70)}...
        </h2>
      </div>
    </Link>
  );
};

export default Section1;
