'use client';

import { useState } from 'react';

import PasswordInput from '@/components/input/PasswordInput';
import { Loader } from '@/components/loader';
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
import { toast } from '@/components/ui/use-toast';
import { updatePasswordSchema } from '@/lib/schema/auth';
import axiosInstance from '@/services/api/axiosInstance';
import { zodResolver } from '@hookform/resolvers/zod';
import { signOut, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const Password = () => {
  const { data } = useSession();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof updatePasswordSchema>) => {
    setLoading(true);

    try {
      const response = await axiosInstance.put(
        `/auth/settings/password/${data?.user.username}`,
        {
          current_password: values.currentPassword,
          new_password: values.password,
        }
      );

      if (response.status === 200) {
        signOut();

        toast({
          variant: 'success',
          title: 'Success',
          description: 'Your password has been updated successfully.',
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to update your password.',
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
    <div className='flex flex-col items-start'>
      <h4 className='font-josefin_Sans text-lg'>Update Password</h4>

      <p className='font-jost text-sm opacity-75'>
        Update your password to restore access and protect your account.
      </p>

      <Dialog>
        <DialogTrigger asChild>
          <Button size='lg' variant='secondary' className='mt-4'>
            Update Password
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>Update Password</DialogTitle>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
              <FormField
                control={form.control}
                name='currentPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Enter current password'
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Enter new password'
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Enter new password'
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ul>
                <li className='font-jost text-sm list-disc list-inside opacity-75'>
                  Must be at least 6 characters long.
                </li>
                <li className='font-jost text-sm list-disc list-inside opacity-75'>
                  Must contain at least one lowercase letter.
                </li>
                <li className='font-jost text-sm list-disc list-inside opacity-75'>
                  Must contain at least one uppercase letter.
                </li>
                <li className='font-jost text-sm list-disc list-inside opacity-75'>
                  Must contain at least one number.
                </li>
              </ul>

              <div className='pt-6'>
                <Button
                  variant='secondary'
                  className='float-right'
                  disabled={loading}
                >
                  {loading && <Loader />}
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Password;
