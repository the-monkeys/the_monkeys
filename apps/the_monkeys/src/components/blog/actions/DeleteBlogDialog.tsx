'use client';

import React from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import { ALL_DRAFT_BLOGS_QUERY_KEY } from '@/hooks/blog/useGetAllDraftBlogs';
import { BLOGS_BY_USERNAME_QUERY_KEY } from '@/hooks/blog/useGetPublishedBlogByUsername';
import axiosInstance from '@/services/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

export const DeleteBlogDialog = ({
  blogId,
  isDraft,
  size = 18,
}: {
  blogId: string;
  isDraft?: boolean;
  size?: number;
}) => {
  const queryClient = useQueryClient();
  const { data: session } = useAuth();
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);

  const username = session?.username;

  const deleteBlogMutation = useMutation({
    mutationFn: (blogId?: string) => axiosInstance.delete(`/blog/${blogId}`),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Deleted successfully',
      });

      if (isDraft) {
        queryClient.invalidateQueries({
          queryKey: [ALL_DRAFT_BLOGS_QUERY_KEY],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: [BLOGS_BY_USERNAME_QUERY_KEY, username],
        });
      }

      setOpen(false);
    },
    onError: (err: unknown) => {
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
    },
    onSettled: () => {
      setLoading(false);
    },
  });

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
            onClick={() => {
              setLoading(true);
              deleteBlogMutation.mutate(blogId);
            }}
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
