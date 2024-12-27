import React, { FC } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import { UserInfoCard, UserInfoCardCompact } from '@/components/user/userInfo';
import { Blog } from '@/services/blog/blogTypes';
import moment from 'moment';

import { LikesCount } from '../LikesCount';
import { BlogActionsDropdown } from '../actions/BlogActionsDropdown';
import { DeleteBlogDialog } from '../actions/DeleteBlogDialog';
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
  modificationEnable = false,
}) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.blog?.time;

  const { titleDiv, descriptionDiv, imageDiv } = getCardContent({
    blog,
    isDraft,
  });

  return (
    <div className='w-full md:px-6'>
      <div className='space-y-3'>
        <UserInfoCardCompact id={authorId} />

        {isDraft ? (
          <div className='group flex flex-col sm:flex-row gap-4'>
            <div className='flex-1 space-y-1 sm:space-y-2'>
              {titleDiv}
              {descriptionDiv}
            </div>

            {imageDiv && (
              <div className='h-[180px] sm:h-[120px] w-full sm:w-[160px] overflow-hidden rounded-md'>
                {imageDiv}
              </div>
            )}
          </div>
        ) : (
          <Link
            href={`/blog?id=${blogId}`}
            className='group flex flex-col sm:flex-row gap-4'
          >
            <div className='flex-1 space-y-1 sm:space-y-2'>
              {titleDiv}
              {descriptionDiv}
            </div>

            {imageDiv && (
              <div className='h-[180px] sm:h-[120px] w-full sm:w-[160px] bg-foreground-light dark:bg-foreground-dark overflow-hidden rounded-lg'>
                {imageDiv}
              </div>
            )}
          </Link>
        )}
      </div>

      <div className='mt-3 flex justify-between items-center gap-4'>
        <div className='flex items-center gap-[6px]'>
          {status === 'authenticated' && <LikesCount blogId={blog.blog_id} />}
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
