import { Button } from '@/components/ui/button';

import Icon from '../../../../components/icon';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog';

const ProfileDeleteDialog = () => {
  return (
    <Dialog>
      <DialogTrigger className='h-9 w-9 inline-flex items-center justify-center whitespace-nowrap font-jost transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-base rounded-full bg-alert-red text-secondary-white border-2 border-alert-red hover:text-alert-red hover:bg-opacity-0'>
        <Icon name='RiDeleteBin' />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className='text-alert-red'>
          Delete Profile Image
        </DialogTitle>

        <p className='py-2 font-jost'>
          Are you sure you want to delete your profile picture? It will be
          replaced with the default profile.
        </p>

        <div className='flex justify-end'>
          <Button type='button' variant='destructive' className='w-fit'>
            Delete Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDeleteDialog;
