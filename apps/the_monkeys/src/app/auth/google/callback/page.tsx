'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { Loader } from '@/components/loader';
import { googleSSOCallback } from '@/services/auth/auth';
import { useMutation } from '@tanstack/react-query';
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

  const mutation = useMutation({
    mutationFn: googleSSOCallback,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Login successful',
      });

      router.replace('/feed');
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
      <div className='flex justify-end'>
        <LinksRedirectArrow link='/feed'>
          <p className='font-dm_sans font-medium'>Monkeys Feed</p>
        </LinksRedirectArrow>
      </div>

      <FormHeader>
        <FormHeading heading='Welcome Back' />
        <FormSubheading subheading='Log in to continue your journey' />
      </FormHeader>

      {mutation.isIdle || mutation.isPending ? (
        <Loader size={32} />
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

      <div className='mt-6 text-center'>
        <Link
          href='/auth/login'
          className='font-dm_sans hover:underline text-brand-orange'
        >
          Go back to login
        </Link>
      </div>
    </>
  );
}
