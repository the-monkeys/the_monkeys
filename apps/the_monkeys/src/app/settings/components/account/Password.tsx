'use client';

import { useRouter } from 'next/navigation';

import PasswordInput from '@/components/input/PasswordInput';
import { Loader } from '@/components/loader';
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
import { toast } from '@/components/ui/use-toast';
import { updatePasswordSchema } from '@/lib/schema/auth';
import { IUser } from '@/services/models/user';
import { updatePassword } from '@/services/user/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const Password = ({ data }: { data: IUser }) => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Your password has been updated successfully.',
      });

      router.replace('/auth/login');
    },
    onError: (err) => {
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
          description: 'An unknown error occurred.',
        });
      }
    },
  });

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof updatePasswordSchema>) => {
    mutation.mutate({ username: data.username, ...values });
  };

  return (
    <div className='p-1 space-y-2'>
      <p className='text-sm opacity-80'>
        Reset your password to regain access. Forgot it? Change it during login.
      </p>

      <Dialog>
        <DialogTrigger asChild>
          <Button size='lg' variant='secondary' className='mt-4'>
            Update Password
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>Update Password</DialogTitle>

          <DialogDescription className='hidden'></DialogDescription>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
              <FormField
                control={form.control}
                name='currentPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm'>Current Password</FormLabel>
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
                    <FormLabel className='text-sm'>New Password</FormLabel>
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
                    <FormLabel className='text-sm'>Confirm Password</FormLabel>
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

              <ul className='space-y-1'>
                <li className='font-light text-xs sm:text-sm opacity-80 list-disc list-inside'>
                  Must be at least 6 characters long.
                </li>
                <li className='font-light text-xs sm:text-sm opacity-80 list-disc list-inside'>
                  Must contain at least one lowercase letter.
                </li>
                <li className='font-light text-xs sm:text-sm opacity-80 list-disc list-inside'>
                  Must contain at least one uppercase letter.
                </li>
                <li className='font-light text-xs sm:text-sm opacity-80 list-disc list-inside'>
                  Must contain at least one number.
                </li>
              </ul>

              <div className='pt-6'>
                <Button className='float-right' disabled={mutation.isPending}>
                  {mutation.isPending && <Loader />}
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
