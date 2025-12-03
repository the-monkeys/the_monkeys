'use client';

import React from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { PROFILE_DRAFTS_PER_PAGE } from '@/constants/posts';
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
import { useSWRConfig } from 'swr';

export const DeleteBlogDialog = ({
  blogId,
  isDraft,
  page,
  size = 18,
}: {
  blogId: string;
  isDraft?: boolean;
  page: number;
  size?: number;
}) => {
  const { data: session } = useAuth();
  const { mutate } = useSWRConfig();

  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);

  const username = session?.username;

  const offset = page * PROFILE_DRAFTS_PER_PAGE;

  async function deleteBlogById(blogId?: string) {
    if (!blogId) return;

    setLoading(true);

    /*
    try {
      const response = await axiosInstance.delete(`/blog/${blogId}`);

      if (response.status === 200) {
        {
          isDraft
            ? await mutate(
              `/blog/in-my-draft?limit=${PROFILE_DRAFTS_PER_PAGE}&offset=${offset}`,
              undefined,
              { revalidate: true }
            ) : await mutate(`blog/all/${username}`);
        }

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
    */

    const cacheKey = isDraft
      ? `/blog/in-my-draft?limit=${PROFILE_DRAFTS_PER_PAGE}&offset=${offset}`
      : `blog/all/${username}`;

    try {
      await mutate(
        cacheKey,
        async (currentData: any) => {
          // Perform the deletion
          const response = await axiosInstance.delete(`/blog/${blogId}`);

          if (response.status !== 200) {
            throw new Error('Failed to delete blog');
          }

          // Return the updated data
          if (!currentData || !currentData?.blogs) return currentData;

          const updatedBlogs = currentData.blogs.filter(
            (blog: any) => blog.blog_id !== blogId
          );

          return {
            ...currentData,
            blogs: updatedBlogs,
            total_blogs: Math.max((currentData.total_blogs || 0) - 1, 0),
          };
        },
        {
          optimisticData: (currentData: any) => {
            // Immediately show the updated UI
            if (!currentData || !currentData?.blogs) return currentData;

            const updatedBlogs = currentData.blogs.filter(
              (blog: any) => blog.blog_id !== blogId
            );

            return {
              ...currentData,
              blogs: updatedBlogs,
              total_blogs: Math.max((currentData.total_blogs || 0) - 1, 0),
            };
          },
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );

      toast({
        variant: 'success',
        title: 'Success',
        description: 'Deleted successfully',
      });
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
