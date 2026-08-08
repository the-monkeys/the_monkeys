'use client';

import { useEffect, useRef, useState } from 'react';

import { UpdateDetailsFormSkeleton } from '@/components/skeletons/formSkeleton';
import { DeleteProfilePhotoConfirmation } from '@/components/user/dialogs/deleteProfileDialog';
import useGetAuthUserProfile from '@/hooks/user/useGetAuthUserProfile';
import { USER_QUERY_KEY } from '@/hooks/user/useUser';
import { updateProfileSchema } from '@/lib/schema/settings';
import { cn } from '@/lib/utils';
import axiosInstance from '@/services/api/axiosInstance';
import { IUser } from '@/services/models/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUpdateProfileSteps } from '../../store/update-user-profile-steps';
import { ProfilePhotoUploader } from '../profile/ProfilePhotoUploader';
import { UpdateDetailsStep } from '../profile/update-dialog/UpdateDetailsStep';
import { UpdateDialogHeader } from './UpdateDialogHeader';

type Values = z.infer<typeof updateProfileSchema>;

export default function UpdateUserDialog({ data }: { data: IUser }) {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
    isError,
  } = useGetAuthUserProfile(data.username);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const resetStepTimeout = useRef<ReturnType<typeof setTimeout>>();

  const steps = useUpdateProfileSteps((state) => state.steps);
  const currentStep = useUpdateProfileSteps((state) => state.currentStep);
  const resetStep = useUpdateProfileSteps((state) => state.resetStep);

  const form = useForm<Values>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { first_name: '', last_name: '', address: '', bio: '' },
  });

  useEffect(() => {
    if (!user) return;

    form.reset({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      address: user.address || '',
      bio: user.bio || '',
    });
  }, [user, form]);

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

  const onSubmit = async (updatedValues: Values) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/user/${data.username}`, {
        values: {
          ...updatedValues,
          contact_number: user?.contact_number,
          date_of_birth: user?.date_of_birth,
          twitter: user?.twitter,
          linkedin: user?.linkedin,
          instagram: user?.instagram,
          github: user?.github,
        },
      });
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Your profile has been updated successfully',
      });
      handleOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY, data.username],
      });
    } catch {
      toast({ variant: 'error', title: 'Error' });
    } finally {
      setLoading(false);
    }
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
              form={form}
              loading={loading}
              onSubmit={onSubmit}
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
