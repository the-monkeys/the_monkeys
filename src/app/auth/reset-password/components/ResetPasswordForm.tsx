'use client';

import React, { Suspense, useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

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
import { toast } from '@/components/ui/use-toast';
import { resetPasswordSchema } from '@/lib/schema/auth';
import { getResetPasswordToken } from '@/services/auth/auth';
import { axiosInstance } from '@/services/fetcher';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const navigate = useRouter();
  const username = searchParams.get('user');
  const evpw = searchParams.get('evpw');
  const [userToken, setuserToken] = useState<string | undefined>('');
  console.log(username);
  console.log(evpw);

  useEffect(() => {
    getResetPasswordToken(username, evpw)
      .then((res) => {
        console.log(res);
        setuserToken(res?.response.token);
      })
      .catch((err) => {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message,
        });
      });
  }, [username, evpw]);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    axiosInstance
      .post(
        '/auth/update-password',
        {
          new_password: values.password,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Your password has been updated successfully',
        });
        navigate.push('/api/auth/signin');
      })
      .catch((err) => {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message,
        });
      });
  }

  return (
    <div className='grid place-items-center h-screen'>
      <Suspense>
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
      </Suspense>
    </div>
  );
};

export default ResetPasswordForm;
