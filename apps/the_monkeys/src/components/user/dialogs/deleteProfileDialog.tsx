'use client';

import { useState } from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import { PROFILE_IMAGE_QUERY_KEY } from '@/hooks/profile/useProfileImage';
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
import axios from 'axios';

export const DeleteProfilePhotoConfirmation = ({
  username,
  onSuccess,
}: {
  username: string;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const onProfileDelete = async () => {
    setLoading(true);
    try {
      const response = await axiosInstanceV2.delete(
        `/storage/profiles/${username}/profile`
      );

      if (response.status === 200) {
        queryClient.setQueryData([PROFILE_IMAGE_QUERY_KEY, username], null);
        queryClient.invalidateQueries({
          queryKey: [PROFILE_IMAGE_QUERY_KEY, username],
        });
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Your profile photo has been deleted successfully',
        });
        onSuccess();
      }
    } catch (err: unknown) {
      const isMissingProfileImage =
        axios.isAxiosError(err) && err.response?.status === 404;

      if (isMissingProfileImage) {
        // If the server has no photo (404), ensure the client cache is also cleared
        queryClient.setQueryData([PROFILE_IMAGE_QUERY_KEY, username], null);
        queryClient.invalidateQueries({
          queryKey: [PROFILE_IMAGE_QUERY_KEY, username],
        });
        toast({
          variant: 'success',
          title: 'Profile photo removed',
          description: 'Your profile photo has been removed.',
        });
        onSuccess();
      } else {
        const description =
          err instanceof Error
            ? err.message || 'Failed to delete profile photo.'
            : 'An unknown error occurred.';

        toast({
          variant: 'error',
          title: 'Error',
          description,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <p>
        Are you sure you want to delete your profile photo? It will be replaced
        with the default profile.
      </p>
      <div className='mt-4 flex justify-end'>
        <Button
          type='button'
          variant='destructive'
          onClick={onProfileDelete}
          disabled={loading}
        >
          {loading && <Loader />} Yes, Delete
        </Button>
      </div>
    </div>
  );
};

export const DeleteProfileDialog = () => {
  const { data } = useAuth();
  const [open, setOpen] = useState(false);

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
        <DialogDescription className='hidden' />
        {data?.username && (
          <DeleteProfilePhotoConfirmation
            username={data.username}
            onSuccess={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
