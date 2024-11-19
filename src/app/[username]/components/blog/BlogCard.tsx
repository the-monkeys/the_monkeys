import React, { FC } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import Icon from '@/components/icon';
import { Block } from '@/services/Blogs/BlogTyptes';
import { purifyHTMLString } from '@/utils/purifyHTML';
import { useSession } from 'next-auth/react';

import { BlogUserInfo } from './BlogUserInfo';
import { DeleteBlogDialog } from './DeleteBlogDialog';

interface BlogCardProps {
  titleBlock: Block;
  descriptionBlock: Block;
  author_id: string;
  date: number;
  blogId: string;
  isDraft?: boolean;
  onEdit: (blogId: string) => void;
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
      <div className='w-full flex-1 space-y-1'>
        <h2
          dangerouslySetInnerHTML={{ __html: purifyHTMLString(title) }}
          className='font-josefin_Sans text-xl sm:text-2xl group-hover:underline underline-offset-2 decoration-1 capitalize line-clamp-2'
        ></h2>

        <p
          dangerouslySetInnerHTML={{
            __html: purifyHTMLString(descriptionContent),
          }}
          className='font-jost opacity-75 line-clamp-1'
        ></p>
      </div>

      {descriptionType === 'image' && (
        <div className='size-28 md:size-32 overflow-hidden rounded-lg'>
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

export const BlogCard: FC<BlogCardProps> = ({
  titleBlock,
  descriptionBlock,
  author_id,
  date,
  blogId,
  isDraft = false,
  onEdit,
}) => {
  const params = useParams<{ username: string }>();
  const { data: session } = useSession();

  return (
    <div className='w-full md:px-6 first:pt-0 py-6 space-y-4 border-b-1 border-secondary-lightGrey/15 last:border-none'>
      <div>
        <BlogUserInfo user_id={author_id} date={date} />

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

      <div className='flex justify-between items-center gap-4'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1 opacity-75'>
            <Icon name='RiHeart3' />
            <span className='font-jost text-xs sm:text-sm'>27</span>
          </div>

          <div className='flex items-center gap-1 opacity-75'>
            <Icon name='RiChat4' />
            <span className='font-jost text-xs sm:text-sm'>3</span>
          </div>
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

          {session?.user.username === params.username ? (
            <DeleteBlogDialog blogId={blogId} />
          ) : (
            ''
          )}

          <button className='p-1 flex items-center justify-center cursor-pointer opacity-75 hover:opacity-100'>
            <Icon name='RiMore' type='Fill' />
          </button>
        </div>
      </div>
    </div>
  );
};
