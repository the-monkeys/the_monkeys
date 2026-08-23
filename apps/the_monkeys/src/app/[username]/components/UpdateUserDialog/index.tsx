'use client';

import { useEffect, useRef, useState } from 'react';

import { UpdateDetailsFormSkeleton } from '@/components/skeletons/formSkeleton';
import { DeleteProfilePhotoConfirmation } from '@/components/user/dialogs/deleteProfileDialog';
import useGetAuthUserProfile from '@/hooks/user/useGetAuthUserProfile';
import { cn } from '@/lib/utils';
import { IUser } from '@/services/models/user';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';

import { useUpdateProfileSteps } from '../../store/update-user-profile-steps';
import { ProfilePhotoUploader } from '../profile/ProfilePhotoUploader';
import { UpdateDetailsStep } from '../profile/update-dialog/UpdateDetailsStep';
import { UpdateDialogHeader } from './UpdateDialogHeader';

export default function UpdateUserDialog({ data }: { data: IUser }) {
  const { isLoading, isError } = useGetAuthUserProfile(data.username);
  const [open, setOpen] = useState(false);
  const resetStepTimeout = useRef<ReturnType<typeof setTimeout>>();

  const steps = useUpdateProfileSteps((state) => state.steps);
  const currentStep = useUpdateProfileSteps((state) => state.currentStep);
  const resetStep = useUpdateProfileSteps((state) => state.resetStep);

  useEffect(
    () => () => {
      clearTimeout(resetStepTimeout.current);
    },
    []
  );

  const handleOpenChange = (newOpen: boolean) => {
    clearTimeout(resetStepTimeout.current);
    setOpen(newOpen);
    if (newOpen) {
      resetStep();
      return;
    }
    resetStepTimeout.current = setTimeout(() => resetStep(), 200);
  };

  const handleUpdateStepSuccess = () => {
    handleOpenChange(false);
  };

  if (isError) return null;

  const isDeleteStep = steps[currentStep] === 'delete-image';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='secondary' className='!text-base rounded-full'>
          Update
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          'sm:max-w-md w-[calc(100%-2rem)] sm:w-full flex flex-col p-4 sm:p-6 overflow-y-auto rounded-xl [&>button]:hidden',
          !isDeleteStep &&
            'h-[570px] sm:h-[630px] max-h-[85vh] sm:max-h-[95vh] sm:overflow-hidden'
        )}
      >
        <UpdateDialogHeader />

        <div
          className={cn(
            'mt-4',
            !isDeleteStep && 'flex-1 flex flex-col min-h-0 relative'
          )}
        >
          {isLoading ? (
            <UpdateDetailsFormSkeleton />
          ) : currentStep === 0 ? (
            <UpdateDetailsStep
              username={data.username}
              onSubmitSuccess={handleUpdateStepSuccess}
            />
          ) : isDeleteStep ? (
            <DeleteProfilePhotoConfirmation username={data.username} />
          ) : (
            <ProfilePhotoUploader
              username={data.username}
              onSuccess={() => handleOpenChange(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
