import React, { FC } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import Icon from '@/components/icon';
import { UserInfoCardCompact } from '@/components/user/userInfo';
import { Block } from '@/services/Blogs/BlogTyptes';
import { purifyHTMLString } from '@/utils/purifyHTML';
import moment from 'moment';
import { useSession } from 'next-auth/react';

import { BlogActionsDropdown } from '../actions/BlogActionsDropdown';
import { BookmarkButton } from '../buttons/BookmarkButton';

interface BlogCardProps {
  titleBlock: Block;
  descriptionBlock: Block;
  authorId: string;
  date: number;
  blogId: string;
  isDraft?: boolean;
  onEdit: (blogId: string) => void;
  editEnable?: boolean;
}

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
          className='font-josefin_Sans text-xl sm:text-2xl capitalize line-clamp-2 group-hover:opacity-75'
        ></h2>

        <p
          dangerouslySetInnerHTML={{
            __html: purifyHTMLString(descriptionContent),
          }}
          className='font-jost text-sm sm:text-base opacity-75 line-clamp-1'
        ></p>
      </div>

      {descriptionType === 'image' && (
        <div className='w-[100px] md:w-[120px] h-[80px] md:h-[100px] overflow-hidden rounded-lg'>
          <img
            src={descriptionBlock?.data?.file?.url}
            alt='Blog Image'
            className='h-full w-full object-cover group-hover:scale-110 transition-all'
          />
        </div>
      )}
    </>
  );
};

export const BlogCard: FC<BlogCardProps> = ({
  titleBlock,
  descriptionBlock,
  authorId,
  date,
  blogId,
  isDraft = false,
  onEdit,
  editEnable = false,
}) => {
  const params = useParams<{ username: string }>();
  const { data: session } = useSession();

  return (
    <div className='w-full md:px-6 first:pt-0 py-6'>
      <div className='space-y-4'>
        <UserInfoCardCompact id={authorId} />

        {isDraft ? (
          <div className='flex gap-4'>
            <BlogContent
              titleBlock={titleBlock}
              descriptionBlock={descriptionBlock}
            />
          </div>
        ) : (
          <Link href={`/blog/${blogId}`} className='group flex gap-4'>
            <BlogContent
              titleBlock={titleBlock}
              descriptionBlock={descriptionBlock}
            />
          </Link>
        )}
      </div>

      <div className='pt-4 flex justify-between items-center gap-4'>
        <div className='flex items-center gap-2'>
          <p className='font-jost text-xs opacity-75'>
            {moment(date).format('MMM DD, YYYY')}
          </p>

          <span className='opacity-75'>·</span>

          <BookmarkButton />
        </div>

        <div className='flex items-center justify-end gap-2'>
          {session?.user.username === params.username ? (
            <button
              onClick={() => onEdit(blogId)}
              className='p-1 flex items-center justify-center cursor-pointer opacity-75 hover:opacity-100'
            >
              <Icon name='RiPencil' type='Fill' />
            </button>
          ) : (
            ''
          )}

          <BlogActionsDropdown blogId={blogId} editEnable={editEnable} />
        </div>
      </div>
    </div>
  );
};
