'use client';

import { useState } from 'react';

import Icon from '@/components/icon';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';

import { ProfilePhotoUploader } from './ProfilePhotoUploader';

export const UpdateProfileDialog = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' size='icon' className='rounded-full'>
          <Icon name='RiUpload2' />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-2xl px-4 pb-8'>
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
          <DialogDescription className='hidden'></DialogDescription>
        </DialogHeader>

        <ProfilePhotoUploader
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
