import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { axiosInstance } from '@/services/fetcher';
import { useSession } from 'next-auth/react';

import Icon from '../../../../components/icon';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog';

const ProfileDeleteDialog = () => {
  const { data, status } = useSession();

  const [open, setOpen] = useState<boolean>();

  const onProfileDelete = () => {
    axiosInstance
      .delete(`/files/profile/${data?.user.user_name}/profile`, {
        headers: {
          Authorization: `Bearer ${data?.user.token}`,
        },
      })
      .then((res) => {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Your profile photo has been deleted successfully',
        });

        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to delete profile photo',
        });
      });
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

        <p className='py-2 font-jost'>
          Are you sure you want to delete your profile photo? It will be
          replaced with the default profile.
        </p>

        <div>
          <Button
            type='button'
            variant='destructive'
            className='w-fit float-right'
            onClick={onProfileDelete}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDeleteDialog;
