'use client';

import { useCallback, useEffect, useState } from 'react';
import { Suspense } from 'react';

import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import PasswordInput from '@/components/input/PasswordInput';
import { Loader } from '@/components/loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { resetPasswordSchema } from '@/lib/schema/auth';
import axiosInstanceNoAuth from '@/services/api/axiosInstanceNoAuth';
import { getResetPasswordToken } from '@/services/auth/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { SearchParamsComponent } from './SearchParams';

export const ResetPasswordForm = () => {
  const [searchParams, setSearchParams] = useState<{
    username: string;
    evpw: string;
  }>({ username: '', evpw: '' });
  const navigate = useRouter();
  const [userToken, setUserToken] = useState<string | undefined>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resetTokenStatus, setResetTokenStatus] = useState<{
    loading: boolean;
    status: boolean;
    message: string;
  }>({
    loading: true,
    status: false,
    message: '',
  });

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
          setUserToken(res?.response.token);

          setResetTokenStatus({
            loading: false,
            status: true,
            message: 'Reset token valid. You can proceed.',
          });
        })
        .catch((err) => {
          toast({
            variant: 'error',
            title: 'Error',
            description: err.message,
          });

          setResetTokenStatus({
            loading: false,
            status: false,
            message: 'Reset token invalid. Please try again.',
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
    setLoading(true);
    axiosInstanceNoAuth
      .post('/auth/update-password', {
        new_password: values.password,
      })
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
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className='flex flex-col items-center px-4 py-5'>
      <Suspense fallback={<Loader />}>
        <SearchParamsComponent setSearchParams={updateSearchParams} />
      </Suspense>

      {resetTokenStatus.loading ? (
        <Loader size={32} />
      ) : (
        <Alert
          variant={resetTokenStatus.status ? 'constructive' : 'destructive'}
          className='w-full sm:w-1/2'
        >
          <Icon name='RiErrorWarning' />
          <AlertTitle>
            {resetTokenStatus.status ? 'Success' : 'Error'}
          </AlertTitle>
          <AlertDescription className='text-base'>
            {resetTokenStatus.message}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='mt-4 w-full sm:w-96 space-y-4'
        >
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

          <ul className='space-y-1'>
            <li className='font-roboto font-light text-xs sm:text-sm opacity-80 list-disc list-inside'>
              Must be at least 6 characters long.
            </li>
            <li className='font-roboto font-light text-xs sm:text-sm opacity-80 list-disc list-inside'>
              Must contain at least one lowercase letter.
            </li>
            <li className='font-roboto font-light text-xs sm:text-sm opacity-80 list-disc list-inside'>
              Must contain at least one uppercase letter.
            </li>
            <li className='font-roboto font-light text-xs sm:text-sm opacity-80 list-disc list-inside'>
              Must contain at least one number.
            </li>
          </ul>

          <div className='pt-4'>
            <Button
              variant='default'
              disabled={!resetTokenStatus.status || loading}
              className='float-right'
              type='submit'
            >
              {loading && <Loader />}
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
