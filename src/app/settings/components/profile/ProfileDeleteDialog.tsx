import { useState } from 'react';

import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { axiosInstance } from '@/services/fetcher';
import { useSession } from 'next-auth/react';

const ProfileDeleteDialog = () => {
  const { data } = useSession();

  const [open, setOpen] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);

  const onProfileDelete = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.delete(
        `/files/profile/${data?.user.user_name}/profile`,
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
          description: 'An unknown error occured.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='h-9 w-9 inline-flex items-center justify-center whitespace-nowrap font-jost transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-base rounded-full bg-alert-red text-secondary-white border-2 border-alert-red hover:text-alert-red hover:bg-opacity-0'>
        <Icon name='RiDeleteBin' />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className='text-alert-red'>
          Delete Profile Photo
        </DialogTitle>

        <p className='font-jost text-secondary-darkGrey dark:text-secondary-white'>
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
            Yes, Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDeleteDialog;
