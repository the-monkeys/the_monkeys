import React, { FC } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/services/api/axiosInstance';
import { purifyHTMLString } from '@/utils/purifyHTML';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { mutate } from 'swr';

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
  const { data: session } = useSession();
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);

  async function deleteBlogById(blogId: string) {
    setIsDeleteLoading(true);

    await axiosInstance
      .delete(`/blog/${blogId}`)
      .then(() => {
        setIsDeleteLoading(false);
        mutate(`/blog/all/drafts/${session?.user.account_id}`);
        toast({
          title: 'Success',
          description: 'Blog deleted successfully',
          duration: 3000,
        });
        setOpen(false);
      })
      .catch(() => {
        setIsDeleteLoading(false);
        toast({
          title: 'Error',
          description: 'Error deleting blog',
          duration: 3000,
        });
        setOpen(false);
      });
  }

  return (
    <Link
      href={`/blog/${blogId}`}
      className='w-full sm:px-6 first:pt-2 pt-4 pb-6 border-b-1 border-secondary-lightGrey/25'
    >
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
          <h2
            dangerouslySetInnerHTML={{ __html: purifyHTMLString(title) }}
            className='font-playfair_Display font-semibold text-xl sm:text-2xl capitalize line-clamp-2'
          ></h2>

          <p
            dangerouslySetInnerHTML={{ __html: purifyHTMLString(description) }}
            className='font-jost text-base sm:text-lg opacity-75 line-clamp-3'
          ></p>
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

        <div className='flex gap-3 items-center justify-center'>
          <div
            className='flex w-full items-center gap-2 cursor-pointer'
            onClick={() => onEdit(blogId)}
          >
            <Icon name='RiPencil' />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  className='btn btn-primary'
                  onClick={() => deleteBlogById(blogId)}
                  disabled={isDeleteLoading}
                >
                  Delete {isDeleteLoading ? <Loader /> : ''}
                </Button>
              </DialogFooter>
            </DialogContent>

            <div
              className='flex w-full items-center gap-2 cursor-pointer'
              onClick={() => setOpen(true)}
            >
              <Icon name='RiDeleteBin' />
            </div>
          </Dialog>
          {!isDraft ? (
            <div className='flex w-full items-center gap-2 cursor-pointer'>
              <Icon name='RiShareForward' />
              <p className='font-josefin_Sans text-base'>Share</p>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
