'use client';

import { useEffect, useState } from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { EditDetailsFormSkeleton } from '@/components/skeletons/formSkeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import useGetAuthUserProfile from '@/hooks/useGetAuthUserProfile';
import axiosInstance from '@/services/api/axiosInstance';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import { z } from 'zod';

const formschema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  address: z.string().optional(),
  bio: z.string().optional(),
});

const EditDialog = () => {
  const { data } = useSession();
  const { user, isLoading, isError } = useGetAuthUserProfile(
    data?.user.user_name
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formschema>>({
    resolver: zodResolver(formschema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      address: user?.address || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = async (updatedvalues: z.infer<typeof formschema>) => {
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
      await axiosInstance.put(`/user/${data?.user.user_name}`, {
        values,
      });
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Your profile has been updated successfully',
      });
      setOpen(false);
      mutate(`/user/public/${data?.user.user_name}`);
      mutate(`/user/${data?.user.user_name}`);
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Error',
      });
    } finally {
      setLoading(false);
    }
  };

  // if (isLoading) return <Loader />;
  if (isError) return null;

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='p-2 flex w-full items-center gap-2 hover:opacity-75'>
        <Icon name='RiEdit' />
        <p className='font-josefin_Sans text-base'>Edit Details</p>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Details</DialogTitle>
        {isLoading ? (
          <EditDetailsFormSkeleton />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='first_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-sm'>
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
                    <FormLabel className='font-josefin_Sans text-sm'>
                      Last Name
                    </FormLabel>
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
                    <FormLabel className='font-josefin_Sans text-sm'>
                      Location
                    </FormLabel>
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
                    <FormLabel className='font-josefin_Sans text-sm'>
                      Bio
                    </FormLabel>
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
                  variant='secondary'
                  disabled={loading}
                  type='submit'
                  className='float-right'
                >
                  {loading && <Loader />} Update Details
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
