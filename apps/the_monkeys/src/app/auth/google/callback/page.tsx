'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { googleSSOCallback } from '@/services/auth/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@the-monkeys/ui/atoms/alert';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

import {
  FormHeader,
  FormHeading,
  FormSubheading,
} from '../../components/formHeading';

export default function GoogleCallback() {
  const params = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: googleSSOCallback,
    onSuccess: (user) => {
      queryClient.setQueryData(['auth'], user);

      toast({
        variant: 'success',
        title: 'Login successful',
      });

      router.replace('/');
    },
    onError: () => {
      toast({
        variant: 'error',
        title: 'Login Failed',
      });
    },
  });

  useEffect(() => {
    const code = params.get('code') || '';

    mutation.mutate(code);
  }, []);

  return (
    <>
      <FormHeader>
        <FormHeading heading='Welcome Back' />
        <FormSubheading subheading='Login with Google, and continue your journey.' />
      </FormHeader>

      {mutation.isIdle || mutation.isPending ? (
        <div className='p-6 flex items-center justify-center'>
          <Loader size={32} />
        </div>
      ) : (
        <Alert variant={mutation.isSuccess ? 'constructive' : 'destructive'}>
          <Icon name='RiErrorWarning' />
          <AlertTitle>{mutation.isSuccess ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription className='text-base'>
            {mutation.isError
              ? 'An error occurred during login.'
              : 'Login Successful'}
          </AlertDescription>
        </Alert>
      )}

      <div className='mt-4 text-center'>
        <span>Go back to </span>

        <Link
          href='/auth/login'
          className='font-medium hover:underline text-brand-orange'
        >
          Login
        </Link>
      </div>
    </>
  );
}
