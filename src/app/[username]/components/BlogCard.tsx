import React, { FC } from 'react';

import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import moment from 'moment';

interface BlogCardProps {
  title: string;
  description: string;
  author: string;
  date: number;
  tags?: string[];
  blogId: string;
  onEdit: (blogId: string) => void;
}

const BlogCard: FC<BlogCardProps> = ({
  title,
  description,
  author,
  date,
  tags,
  blogId,
  onEdit,
}) => {
  return (
    <div className='w-full sm:px-6 first:pt-2 pt-4 pb-6 border-b-1 border-secondary-lightGrey/25'>
      <div className='space-y-4'>
        <div className='flex justify-between'>
          <p className='font-josefin_Sans text-xs sm:text-sm opacity-85'>
            <span className='italic font-light opacity-75'>written by</span>{' '}
            {author}
          </p>

          <p className='font-josefin_Sans text-xs sm:text-sm opacity-85'>
            <span className='italic font-light opacity-75'>on</span>{' '}
            {moment(date).format('DD MMM, YYYY')}
          </p>
        </div>

        <div className='space-y-2'>
          <h2 className='font-playfair_Display font-semibold text-xl sm:text-2xl capitalize line-clamp-2'>
            {title}
          </h2>

          <p className='font-jost text-base sm:text-lg opacity-75 line-clamp-3'>
            {description}
          </p>
        </div>
      </div>

      <div className='py-3 flex justify-between'>
        <div className='space-x-1'>
          {tags?.map((tag) => (
            <Badge
              variant='secondary'
              key={tag}
              className='py-[1px] text-xs sm:text-sm'
            >
              {tag}
            </Badge>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className='hover:opacity-75 cursor-pointer'>
              <Icon name='RiMore' size={24} />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='m-2'>
            <DropdownMenuItem onClick={() => onEdit(blogId)}>
              <div className='flex w-full items-center gap-2'>
                <Icon name='RiPencil' />
                <p className='font-josefin_Sans text-base'>Edit</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <div className='flex w-full items-center gap-2'>
                <Icon name='RiShareForward' />
                <p className='font-josefin_Sans text-base'>Share</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default BlogCard;
