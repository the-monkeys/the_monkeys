'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Suspense } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
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
import axiosInstanceNoAuth from '@/services/api/axiosInstanceNoAuth';
import { getResetPasswordToken } from '@/services/auth/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import SearchParamsComponent from './SearchParams';

const ResetPasswordForm: React.FC = () => {
  const [searchParams, setSearchParams] = useState<{
    username: string;
    evpw: string;
  }>({ username: '', evpw: '' });
  const navigate = useRouter();
  const [userToken, setUserToken] = useState<string | undefined>('');

  const updateSearchParams = useCallback(
    (params: { username: string; evpw: string }) => {
      setSearchParams(params);
    },
    []
  );

  useEffect(() => {
    if (searchParams.username && searchParams.evpw) {
      getResetPasswordToken({
        user: searchParams.username,
        evpw: searchParams.evpw,
      })
        .then((res) => {
          console.log('hello');

          console.log(res);
          setUserToken(res?.response.token);
        })
        .catch((err) => {
          toast({
            variant: 'error',
            title: 'Error',
            description: err.message,
          });
        });
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    axiosInstanceNoAuth
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
          description: 'Your password has been updated successfully.',
        });
        navigate.push('/api/auth/signin');
      })
      .catch((err) => {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to update the password.',
        });
      });
  }

  return (
    <div className='flex flex-col items-center px-5 py-4'>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsComponent setSearchParams={updateSearchParams} />
      </Suspense>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full sm:w-96 space-y-4'
        >
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

          <div className='pt-4'>
            <Button variant='default' className='float-right' type='submit'>
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
