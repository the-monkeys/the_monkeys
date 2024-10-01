import React, { FC } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/services/api/axiosInstance';
import { purifyHTMLString } from '@/utils/purifyHTML';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { mutate } from 'swr';

import BlogDeleteDialog from './BlogDeleteDialog';

interface BlogCardProps {
  title: string;
  description: string;
  author: string;
  date: number;
  tags?: string[];
  blogId: string;
  isDraft?: boolean;
  onEdit: (blogId: string) => void;
}

const BlogCard: FC<BlogCardProps> = ({
  title,
  description,
  author,
  date,
  tags,
  blogId,
  isDraft = false,
  onEdit,
}) => {
  // const { data: session } = useSession();
  // const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false);
  // const [open, setOpen] = React.useState<boolean>(false);

  // async function deleteBlogById(blogId: string) {
  //   setIsDeleteLoading(true);

  //   await axiosInstance
  //     .delete(`/blog/${blogId}`)
  //     .then(() => {
  //       setIsDeleteLoading(false);
  //       mutate(`/blog/all/drafts/${session?.user.account_id}`);
  //       toast({
  //         title: 'Success',
  //         description: 'Blog deleted successfully',
  //         duration: 3000,
  //       });
  //       setOpen(false);
  //     })
  //     .catch(() => {
  //       setIsDeleteLoading(false);
  //       toast({
  //         title: 'Error',
  //         description: 'Error deleting blog',
  //         duration: 3000,
  //       });
  //       setOpen(false);
  //     });
  // }

  return (
    <div className='w-full md:px-6 first:pt-0 py-6 space-y-6 border-b-1 border-secondary-lightGrey/15'>
      <div className='cursor-default'>
        <p className='mb-2 md:mb-4 font-josefin_Sans text-sm'>
          {author}
          <span className='px-2 font-light'>on</span>
          {moment(date).format('DD MMM, YYYY')}
        </p>

        {isDraft ? (
          <div className='space-y-1'>
            <h2
              dangerouslySetInnerHTML={{ __html: purifyHTMLString(title) }}
              className='font-josefin_Sans font-semibold text-xl sm:text-2xl capitalize line-clamp-2'
            ></h2>

            <p
              dangerouslySetInnerHTML={{
                __html: purifyHTMLString(description),
              }}
              className='font-jost opacity-75 line-clamp-2'
            ></p>
          </div>
        ) : (
          <Link
            href={`/blogs/${blogId}`}
            className='space-y-1 hover:opacity-75'
          >
            <h2
              dangerouslySetInnerHTML={{ __html: purifyHTMLString(title) }}
              className='font-josefin_Sans font-semibold text-xl sm:text-2xl capitalize line-clamp-2'
            ></h2>

            <p
              dangerouslySetInnerHTML={{
                __html: purifyHTMLString(description),
              }}
              className='font-jost opacity-75 line-clamp-2'
            ></p>
          </Link>
        )}
      </div>

      <div className='flex gap-4'>
        <div className='flex-1 flex items-center gap-1 overflow-hidden'>
          {tags?.map((tag) => (
            <Badge variant='secondary' key={tag} className='font-josefin_Sans'>
              {tag}
            </Badge>
          ))}
        </div>

        <div className='flex items-center justify-end gap-2'>
          <div
            onClick={() => onEdit(blogId)}
            className='p-1 flex items-center justify-center cursor-pointer hover:opacity-75'
          >
            <Icon name='RiPencil' />
          </div>

          <BlogDeleteDialog blogId={blogId} title={title} />

          {!isDraft ? (
            <div className='p-1 flex items-center justify-center cursor-pointer hover:opacity-75'>
              <Icon name='RiShareForward' />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
