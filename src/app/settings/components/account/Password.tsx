'use client';

import Link from 'next/link';

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
import { resetPasswordSchema } from '@/lib/schema/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const Password = () => {
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

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
            <form className='space-y-2'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter current password'
                        type='password'
                        {...field}
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
                      <Input
                        placeholder='Enter new password'
                        type='password'
                        {...field}
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
                      <Input
                        placeholder='Enter new password'
                        type='password'
                        {...field}
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

              <div className='pt-6 flex justify-end'>
                <Button>Update Password</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Password;
