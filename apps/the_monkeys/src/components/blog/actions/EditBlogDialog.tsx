'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import { ALL_DRAFT_BLOGS_QUERY_KEY } from '@/hooks/blog/useGetAllDraftBlogs';
import { BLOGS_BY_USERNAME_QUERY_KEY } from '@/hooks/blog/useGetPublishedBlogByUsername';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

export const EditBlogDialog = ({ blogId }: { blogId: string }) => {
  const queryClient = useQueryClient();
  const { data: session } = useAuth();
  const [isLoading, setIsLoading] = React.useState<{
    button1: boolean;
    button2: boolean;
  }>({
    button1: false,
    button2: false,
  });
  const [open, setOpen] = React.useState<boolean>(false);

  const router = useRouter();

  const username = session?.username;

  const handleEdit = (blogId: string) => {
    router.push(`/edit/${blogId}`);
  };

  async function editBlogById({
    blogId,
    buttonType,
    edit = false,
  }: {
    blogId: string;
    buttonType: 'M' | 'ME'; // M -> move to draft | ME -> move and edit
    edit?: boolean;
  }) {
    setIsLoading((prev) => ({
      ...prev,
      [buttonType === 'ME' ? 'button1' : 'button2']: true,
    }));

    try {
      const response = await axiosInstanceV2.post(`/blog/to-draft/${blogId}`);
      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Converted to draft successfully',
        });
        setOpen(false);
      }

      queryClient.invalidateQueries({
        queryKey: [BLOGS_BY_USERNAME_QUERY_KEY, username],
      });
      queryClient.invalidateQueries({ queryKey: [ALL_DRAFT_BLOGS_QUERY_KEY] });

      if (edit) {
        handleEdit(blogId);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to convert blog.',
        });
      } else {
        toast({
          variant: 'error',
          title: 'Error',
          description: 'An unknown error occurred.',
        });
      }
    } finally {
      setIsLoading({
        button1: false,
        button2: false,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className='p-1 flex items-center justify-center cursor-pointer opacity-80 hover:opacity-100'
          title='Convert to Draft'
        >
          <Icon name='RiPencil' size={18} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Move to Draft?</DialogTitle>

        <DialogDescription className='hidden'></DialogDescription>

        <p className='opacity-80'>
          Moving this post to drafts will remove all the reactions it has
          received. Are you sure you want to proceed?
        </p>

        <div className='pt-4 flex justify-end items-end gap-2'>
          <Button
            type='button'
            variant='secondary'
            className='w-fit float-right'
            onClick={() =>
              editBlogById({ blogId, buttonType: 'ME', edit: true })
            }
            disabled={isLoading.button1 || isLoading.button2}
          >
            {isLoading.button1 && <Loader />}
            Move & Edit
          </Button>

          <Button
            type='button'
            className='w-fit float-right'
            onClick={() => editBlogById({ blogId, buttonType: 'M' })}
            disabled={isLoading.button1 || isLoading.button2}
          >
            {isLoading.button2 && <Loader />}
            Move
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
