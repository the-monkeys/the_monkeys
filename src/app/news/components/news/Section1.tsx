import React from 'react';

const Section1 = ({
  urlToImage,
  title,
}: {
  urlToImage: string;
  title: string;
}) => {
  return (
    <div className='article bg-white rounded overflow-hidden shadow-md'>
      <img
        src={urlToImage}
        alt='Article 3'
        className='w-full h-48 object-cover'
      />
      <h2 className='text-lg font-semibold mt-4 px-4 pb-2 dark:text-black'>
        {title.slice(0, 70)}...
      </h2>
    </div>
  );
};

export default Section1;
