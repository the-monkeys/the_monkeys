'use client';

import { useEffect, useState } from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { UpdateDetailsFormSkeleton } from '@/components/skeletons/formSkeleton';
import { DeleteProfileDialog } from '@/components/user/dialogs/deleteProfileDialog';
import useGetAuthUserProfile from '@/hooks/user/useGetAuthUserProfile';
import { USER_QUERY_KEY } from '@/hooks/user/useUser';
import axiosInstance from '@/services/api/axiosInstance';
import { IUser } from '@/services/models/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import { Input } from '@the-monkeys/ui/atoms/input';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@the-monkeys/ui/molecules/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ProfilePhotoUploader, Step } from './ProfilePhotoUploader';

const updateProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});

export const UpdateDialog = ({ data }: { data: IUser }) => {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
    isError,
  } = useGetAuthUserProfile(data.username);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [step, setStep] = useState<Step>('details');

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      address: '',
      bio: '',
    },
  });

  const onSubmit = async (
    updatedvalues: z.infer<typeof updateProfileSchema>
  ) => {
    const values = {
      ...updatedvalues,
      contact_number: user?.contact_number,
      date_of_birth: user?.date_of_birth,
      twitter: user?.twitter,
      linkedin: user?.linkedin,
      instagram: user?.instagram,
      github: user?.github,
    };

    setLoading(true);

    try {
      await axiosInstance.put(`/user/${data.username}`, {
        values,
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
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        address: user.address || '',
        bio: user.bio || '',
      });
    }
  }, [user, form]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setStep('details');
    }
  };

  if (isError) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='secondary' className='!text-base rounded-full'>
          Update
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md w-[calc(100%-2rem)] sm:w-full h-[570px] sm:h-[630px] max-h-[85vh] sm:max-h-[95vh] flex flex-col p-4 sm:p-6 overflow-y-auto sm:overflow-hidden rounded-xl'>
        <DialogHeader className='flex flex-row items-center relative h-8 shrink-0'>
          {step !== 'details' && (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='rounded-full shrink-0 h-8 w-8 p-0'
              onClick={() =>
                setStep(step === 'confirm-image' ? 'select-image' : 'details')
              }
            >
              <Icon name='RiArrowLeft' />
            </Button>
          )}
          <DialogTitle className='flex-1 text-left py-0 leading-tight'>
            {{ details: 'Update Details', 'select-image': 'Select Photo', 'confirm-image': 'Confirm Photo' }[step]}
          </DialogTitle>
          <DialogDescription className='hidden'></DialogDescription>
        </DialogHeader>

        <div className='flex-1 flex flex-col mt-4 min-h-0 relative'>
          {isLoading ? (
            <UpdateDetailsFormSkeleton />
          ) : (
            <>
              {step === 'details' && (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='flex flex-col h-full flex-1 animate-in fade-in duration-300 fill-mode-forwards'
                  >
                    <div className='flex-1 space-y-3 sm:space-y-4 pt-2'>
                      <div className='flex flex-wrap items-end gap-2'>
                        <p className='w-full text-sm'>Profile Photo</p>
                        <ProfileFrame className='size-20 sm:size-24'>
                          <ProfileImage username={data.username} />
                        </ProfileFrame>
                        <div className='space-x-2'>
                          <DeleteProfileDialog />
                          <Button
                            type='button'
                            variant='secondary'
                            size='icon'
                            className='rounded-full'
                            onClick={() => setStep('select-image')}
                          >
                            <Icon name='RiUpload2' />
                          </Button>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name='first_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm'>
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='w-full'
                                {...field}
                                placeholder='Enter first name'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='last_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm'>Last Name</FormLabel>
                            <FormControl>
                              <Input
                                className='w-full'
                                {...field}
                                placeholder='Enter last name'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='address'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm'>Location</FormLabel>
                            <FormControl>
                              <Input
                                className='w-full'
                                {...field}
                                placeholder='Enter location'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='bio'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm'>Bio</FormLabel>
                            <FormControl>
                              <Input
                                className='w-full'
                                {...field}
                                placeholder='Enter bio'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='flex justify-end pt-4 mt-auto shrink-0'>
                      <Button disabled={loading} type='submit'>
                        {loading && <Loader />} Update
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {(step === 'select-image' || step === 'confirm-image') && (
                <ProfilePhotoUploader
                  step={step}
                  setStep={setStep}
                  onSuccess={() => handleOpenChange(false)}
                />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
