'use client';

import { useState } from 'react';

import { useSession } from '@/app/session-store-provider';
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
import axiosInstance from '@/services/api/axiosInstance';
import { mutate } from 'swr';

export const DeleteProfileDialog = () => {
  const { data } = useSession();

  const [open, setOpen] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);

  const onProfileDelete = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.delete(
        `/files/profile/${data?.user.username}/profile`,
        {
          headers: {
            Authorization: `Bearer ${data?.user.token}`,
          },
        }
      );

      if (response.status === 202) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Your profile photo has been deleted successfully',
        });

        setOpen(false);
      }

      mutate(`/files/profile/${data?.user.username}/profile`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to delete profile photo.',
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive' size='icon' className='rounded-full'>
          <Icon name='RiDeleteBin6' />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className='text-alert-red'>
          Delete Profile Photo
        </DialogTitle>

        <DialogDescription className='hidden'></DialogDescription>

        <p>
          Are you sure you want to delete your profile photo? It will be
          replaced with the default profile.
        </p>

        <div>
          <Button
            type='button'
            variant='destructive'
            className='w-fit float-right'
            onClick={onProfileDelete}
            disabled={loading}
          >
            {loading && <Loader />}
            Yes, Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
