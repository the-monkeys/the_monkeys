'use client';

import React from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import axiosInstance from '@/services/api/axiosInstance';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { mutate } from 'swr';

export const DeleteBlogDialog = ({
  blogId,
  isDraft,
  size = 18,
}: {
  blogId: string;
  isDraft?: boolean;
  size?: number;
}) => {
  const { data: session } = useAuth();
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);

  const username = session?.username;

  async function deleteBlogById(blogId?: string) {
    if (!blogId) return;

    setLoading(true);

    try {
      const response = await axiosInstance.delete(`/blog/${blogId}`);

      if (response.status === 200) {
        {
          isDraft
            ? mutate(`/blog/in-my-draft`, undefined, { revalidate: true })
            : mutate(`blog/all/${username}`);
        }

        // Optimistically updating the cached data
        /*if(isDraft) {
          await mutate(
            (key) => {
              return typeof key === 'string' && key.startsWith('/blog/in-my-draft');
            },
            async (currentData: any) => {
              if (!currentData || !currentData?.blogs) return currentData;

              // Filter out the deleted blog
              const updatedBlogs = currentData.blogs.filter(
                (blog: any) => blog.blog_id !== blogId
              );

              return {
                ...currentData,
                blogs: updatedBlogs,
                total_blogs: currentData.total_blogs ? currentData.total_blogs - 1 : 0,
              };
            },
            { revalidate: false }
          );
        }else {
          mutate(`blog/all/${username}`);
        }*/

        toast({
          variant: 'success',
          title: 'Success',
          description: 'Deleted successfully',
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to delete blog.',
        });
      } else {
        toast({
          variant: 'error',
          title: 'Error',
          description: 'An unknown error occurred.',
        });
      }
    } finally {
      setOpen(false);
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className='p-1 flex items-center justify-center cursor-pointer opacity-80 hover:opacity-100'
          title='Delete Blog'
        >
          <Icon name='RiDeleteBin6' size={size} className='text-alert-red' />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>{isDraft ? 'Remove Draft' : 'Delete Blog'}</DialogTitle>

        <DialogDescription className='hidden'></DialogDescription>

        <p className='opacity-80'>
          Are you sure you want to delete this blog? This action cannot be
          undone.
        </p>

        <div className='pt-4'>
          <Button
            type='button'
            variant='destructive'
            className='w-fit float-right'
            onClick={() => deleteBlogById(blogId)}
            disabled={isLoading}
          >
            {isLoading && <Loader />}
            Yes, {isDraft ? 'Remove' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
