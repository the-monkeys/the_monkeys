'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Suspense } from 'react';

import { useRouter } from 'next/navigation';

import PageHeading from '@/components/pageHeading';
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
import { getResetPasswordToken } from '@/services/auth/auth';
import { axiosInstance } from '@/services/fetcher';
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
      getResetPasswordToken(searchParams.username, searchParams.evpw)
        .then((res) => {
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
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsComponent setSearchParams={updateSearchParams} />
      </Suspense>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <PageHeading heading='Reset Password' />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    className='min-w-[303px]'
                    variant='default'
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
                    variant='default'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant='default'
            className='float-right mt-[26px]'
            type='submit'
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
