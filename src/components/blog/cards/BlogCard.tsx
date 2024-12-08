import React, { FC } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import { UserInfoCardCompact } from '@/components/user/userInfo';
import { Blog } from '@/services/blog/blogTypes';
import moment from 'moment';

import { BlogActionsDropdown } from '../actions/BlogActionsDropdown';
import { DeleteBlogDialog } from '../actions/DeleteBlogDialog';
import { BookmarkButton } from '../buttons/BookmarkButton';
import { getCardContent } from '../getBlogContent';

interface BlogCardProps {
  blog: Blog;
  status: 'authenticated' | 'loading' | 'unauthenticated';
  isDraft?: boolean;
  onEdit: (blogId: string) => void;
  modificationEnable?: boolean;
  bookmarkEnable?: boolean;
}

export const BlogCard: FC<BlogCardProps> = ({
  blog,
  status,
  isDraft = false,
  onEdit,
  bookmarkEnable = true,
  modificationEnable = false,
}) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.blog?.time;

  const { titleDiv, descriptionDiv, imageDiv } = getCardContent(blog);

  return (
    <div className='w-full px-2 sm:px-4 md:px-6'>
      <div className='space-y-2'>
        <UserInfoCardCompact id={authorId} />

        {isDraft ? (
          <div className='group flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              {titleDiv}
              {descriptionDiv}
            </div>

            {imageDiv && (
              <div className='h-[180px] sm:h-[120px] w-full sm:w-[160px] overflow-hidden border-1 border-foreground-light dark:border-foreground-dark rounded-md'>
                {imageDiv}
              </div>
            )}
          </div>
        ) : (
          <Link
            href={`/blog/${blogId}`}
            className='group flex flex-col sm:flex-row gap-4'
          >
            <div className='flex-1'>
              {titleDiv}
              {descriptionDiv}
            </div>

            {imageDiv && (
              <div className='h-[180px] sm:h-[120px] w-full sm:w-[160px] bg-foreground-light dark:bg-foreground-dark overflow-hidden rounded-md shadow-md'>
                {imageDiv}
              </div>
            )}
          </Link>
        )}
      </div>

      <div className='mt-2 flex justify-between items-center gap-4'>
        <div className='flex items-center gap-2'>
          <p className='font-roboto text-xs'>
            {moment(date).format('MMM DD, YYYY')}
          </p>

          {status === 'authenticated' && bookmarkEnable && (
            <BookmarkButton blogId={blogId} />
          )}
        </div>

        <div className='flex items-center gap-1'>
          {status === 'authenticated' && modificationEnable && (
            <button
              onClick={() => onEdit(blogId)}
              className='p-1 flex items-center justify-center cursor-pointer opacity-100 hover:opacity-80'
            >
              <Icon name='RiPencil' size={18} />
            </button>
          )}

          {status === 'authenticated' && modificationEnable && (
            <DeleteBlogDialog blogId={blogId} />
          )}

          {!isDraft && <BlogActionsDropdown blogId={blogId} />}
        </div>
      </div>
    </div>
  );
};
