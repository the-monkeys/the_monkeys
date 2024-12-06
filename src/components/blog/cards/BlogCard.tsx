import React, { FC } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import { UserInfoCardCompact } from '@/components/user/userInfo';
import { Block } from '@/services/blog/blogTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';
import moment from 'moment';

import { BlogActionsDropdown } from '../actions/BlogActionsDropdown';
import { DeleteBlogDialog } from '../actions/DeleteBlogDialog';
import { BookmarkButton } from '../buttons/BookmarkButton';

const BlogContent = ({
  titleBlock,
  descriptionBlock,
}: {
  titleBlock: Block;
  descriptionBlock?: Block;
}) => {
  const title = titleBlock.data.text;
  const descriptionType = descriptionBlock?.type;
  let descriptionContent;

  switch (descriptionType) {
    case 'list':
      descriptionContent = descriptionBlock?.data?.items[0];
      break;
    case 'paragraph':
      descriptionContent = descriptionBlock?.data?.text;
      break;
    case 'header':
      descriptionContent = descriptionBlock?.data?.text;
      break;
    default:
      descriptionContent = title;
  }

  return (
    <>
      <div className='flex-1 space-y-1'>
        <h2
          dangerouslySetInnerHTML={{ __html: purifyHTMLString(title) }}
          className='font-roboto font-medium text-lg sm:text-xl capitalize line-clamp-2 group-hover:underline underline-offset-2 decoration-1'
        ></h2>

        <p
          dangerouslySetInnerHTML={{
            __html: purifyHTMLString(descriptionContent),
          }}
          className='font-roboto text-sm sm:text-base opacity-80 line-clamp-1 sm:line-clamp-2'
        ></p>
      </div>

      {descriptionType === 'image' && (
        <div className='h-[80px] sm:h-[110px] w-[100px] sm:w-[150px] overflow-hidden rounded-md'>
          <img
            src={descriptionBlock?.data?.file?.url}
            alt='Blog Image'
            className='h-full w-full object-cover'
          />
        </div>
      )}
    </>
  );
};

interface BlogCardProps {
  status: 'authenticated' | 'loading' | 'unauthenticated';
  titleBlock: Block;
  descriptionBlock: Block;
  authorId: string;
  date: number;
  blogId: string;
  isDraft?: boolean;
  onEdit: (blogId: string) => void;
  modificationEnable?: boolean;
  bookmarkEnable?: boolean;
}

export const BlogCard: FC<BlogCardProps> = ({
  status,
  titleBlock,
  descriptionBlock,
  authorId,
  date,
  blogId,
  isDraft = false,
  onEdit,
  bookmarkEnable = true,
  modificationEnable = false,
}) => {
  return (
    <div className='w-full md:px-6 pt-4 pb-6 first:pt-0'>
      <div className='space-y-2'>
        <UserInfoCardCompact id={authorId} />

        {isDraft ? (
          <div className='flex gap-2'>
            <BlogContent
              titleBlock={titleBlock}
              descriptionBlock={descriptionBlock}
            />
          </div>
        ) : (
          <Link href={`/blog/${blogId}`} className='group flex gap-2'>
            <BlogContent
              titleBlock={titleBlock}
              descriptionBlock={descriptionBlock}
            />
          </Link>
        )}
      </div>

      <div className='mt-3 flex justify-between items-center gap-4'>
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
              <Icon name='RiPencil' />
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
