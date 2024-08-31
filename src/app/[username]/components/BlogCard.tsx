import React, { FC } from 'react';

import moment from 'moment';

interface BlogCardProps {
  title: string;
  description: string;
  author: string;
  date: number;
  tags?: string[];
}
const BlogCard: FC<BlogCardProps> = ({
  title,
  description,
  author,
  date,
  tags,
}) => {
  return (
    <div className='  border rounded p-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <button className='text-sm text-blue-500'>Edit</button>
      </div>
      <p className='text-sm text-gray-500'>{description}</p>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          Tags:{' '}
          {tags?.map((tag) => (
            <span key={tag} className='text-sm text-gray-500'>
              {tag}
            </span>
          ))}
        </div>
        <p className='text-sm text-gray-500'>
          {moment(date).format('DD MMM, YYYY')}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
