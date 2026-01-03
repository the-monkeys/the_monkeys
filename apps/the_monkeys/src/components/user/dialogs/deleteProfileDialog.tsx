'use client';

import { useState } from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import { PROFILE_IMAGE_QUERY_KEY } from '@/hooks/profile/useProfileImage';
import axiosInstance from '@/services/api/axiosInstance';
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

export const DeleteProfileDialog = () => {
  const queryClient = useQueryClient();
  const { data } = useAuth();

  const [open, setOpen] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);

  const onProfileDelete = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.delete(
        `/files/profile/${data?.username}/profile`
      );

      if (response.status === 202) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Your profile photo has been deleted successfully',
        });

        setOpen(false);
      }

      queryClient.invalidateQueries({
        queryKey: [PROFILE_IMAGE_QUERY_KEY, data?.username],
      });
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
