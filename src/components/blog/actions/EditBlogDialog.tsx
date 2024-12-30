'use client';

import React from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { useSession } from 'next-auth/react';
import { mutate } from 'swr';

export const EditBlogDialog = ({ blogId }: { blogId: string }) => {
  const { data: session } = useSession();
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);

  const username = session?.user.username;

  async function deleteBlogById(blogId?: string) {
    setLoading(true);

    try {
      const response = await axiosInstanceV2.post(`/blog/to-draft/${blogId}`);

      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Converted to draft successfully',
        });

        setOpen(false);
      }

      mutate(`/blog/all/${username}`, undefined, {
        revalidate: true,
      });
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
          description: 'An unknown error occured.',
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
          className='p-1 flex items-center justify-center cursor-pointer hover:opacity-80'
          title='Convert to Draft'
        >
          <Icon name='RiPencil' size={18} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Convert to Draft?</DialogTitle>

        <DialogDescription className='hidden'></DialogDescription>

        <p className='opacity-80'>
          Converting this blog to a draft will remove all reactions it has
          received. Are you sure you want to proceed?
        </p>

        <div className='pt-4'>
          <Button
            type='button'
            className='w-fit float-right'
            onClick={() => deleteBlogById(blogId)}
            disabled={isLoading}
          >
            {isLoading && <Loader />}
            Yes, Convert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
// );
