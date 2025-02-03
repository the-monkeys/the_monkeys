'use client';

import { useEffect, useState } from 'react';

import { Loader } from '@/components/loader';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { UpdateDetailsFormSkeleton } from '@/components/skeletons/formSkeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { DeleteProfileDialog } from '@/components/user/dialogs/deleteProfileDialog';
import { UpdateProfileDialog } from '@/components/user/dialogs/updateProfileDialog';
import useGetAuthUserProfile from '@/hooks/user/useGetAuthUserProfile';
import axiosInstance from '@/services/api/axiosInstance';
import { IUser } from '@/services/models/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import { z } from 'zod';

const updateProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  address: z.string().optional(),
  bio: z.string().optional(),
});

export const UpdateDialog = ({ data }: { data: { user: Partial<IUser> } }) => {
  const { user, isLoading, isError } = useGetAuthUserProfile(
    data.user.username
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      address: user?.address || '',
      bio: user?.bio || '',
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
      await axiosInstance.put(`/user/${data.user.username}`, {
        values,
      });

      toast({
        variant: 'success',
        title: 'Success',
        description: 'Your profile has been updated successfully',
      });

      setOpen(false);

      mutate(`/user/public/${data.user.username}`, `${data.user.username}`, {
        revalidate: true,
      });
      mutate(`/user/${data.user.username}`, `${data.user.username}`, {
        revalidate: true,
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

  if (isError) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='!text-base rounded-full'>Update</Button>
      </DialogTrigger>

      <DialogContent className='max-h-[60vh] sm:max-h-[80vh] overflow-auto'>
        <DialogTitle>Update Details</DialogTitle>

        <DialogDescription className='hidden'></DialogDescription>

        {isLoading ? (
          <UpdateDetailsFormSkeleton />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div className='flex flex-wrap items-end gap-2'>
                <p className='w-full text-sm'>Profile Photo</p>

                <ProfileFrame className='size-24'>
                  {data.user && <ProfileImage username={data.user.username} />}
                </ProfileFrame>

                <div className='space-x-2'>
                  <DeleteProfileDialog />

                  <UpdateProfileDialog />
                </div>
              </div>

              <FormField
                control={form.control}
                name='first_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm'>First Name</FormLabel>
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

              <div className='pt-4'>
                <Button
                  disabled={loading}
                  type='submit'
                  className='float-right'
                >
                  {loading && <Loader />} Update
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
