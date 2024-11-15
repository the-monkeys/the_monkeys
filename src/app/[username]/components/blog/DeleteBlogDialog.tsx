'use client';

import React from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/services/api/axiosInstance';
import { purifyHTMLString } from '@/utils/purifyHTML';
import { useSession } from 'next-auth/react';
import { mutate } from 'swr';

export const DeleteBlogDialog = ({
  blogId,
  title,
}: {
  blogId: string;
  title: string;
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='p-1 flex items-center justify-center cursor-pointer hover:opacity-75'>
        <Icon name='RiDeleteBin' />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className='truncate'>
          Delete Blog: {purifyHTMLString(title)}
        </DialogTitle>

        <p className='font-jost text-secondary-darkGrey dark:text-secondary-white'>
          Are you sure you want to delete this blog? This action cannot be
          undone.
        </p>

        <div>
          <Button
            type='button'
            variant='destructive'
            className='w-fit float-right'
            onClick={() => deleteBlogById(blogId)}
            disabled={isDeleteLoading}
          >
            {isDeleteLoading && <Loader />}
            Yes, Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
