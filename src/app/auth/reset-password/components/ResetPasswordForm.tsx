'use client';

import React from 'react';

import { useSearchParams } from 'next/navigation';

import Button from '@/components/button';
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

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get('user');
  console.log(search);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    console.log(values);
  }

  return (
    <div className='grid place-items-center h-screen'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <h1 className='text-4xl font-playfair_Display mb-10 text-center'>
            Reset Password
          </h1>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    className='min-w-[303px]'
                    variant='border'
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
                    className='min-w-[303px]'
                    placeholder='Enter new password'
                    variant='border'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant='primary'
            className='ml-auto mt-[26px]'
            type='submit'
            title='Reset Password'
          />
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
