'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import { API_URL } from '@/constants/api';
import useAuth from '@/hooks/auth/useAuth';
import { Button } from '@the-monkeys/ui/atoms/button';

import {
  FormHeader,
  FormHeading,
  FormSubheading,
} from '../components/formHeading';
import LoginForm from '../components/forms/LoginForm';

export default function LoginPage() {
  const { isSuccess, isLoading, isFetching } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) router.replace('/');
  }, [isSuccess]);

  return (
    <>
      <FormHeader>
        <FormHeading heading='Welcome Back' />
        <FormSubheading subheading='Enter your credentials, or sign in instantly with Google.' />
      </FormHeader>

      <div className='flex flex-col gap-2'>
        <LoginForm isLoading={isLoading || isFetching} />

        <Button className='w-full flex items-center gap-2' asChild>
          <Link href={API_URL + '/auth/google/login'} className='font-dm_sans'>
            <Icon name='RiGoogle' type='Fill' />
            <p className='font-dm_sans'>Login with Google</p>
          </Link>
        </Button>

        <div className='mt-8 text-center'>
          <span>New to Monkeys? </span>

          <Link
            href='/auth/register'
            className='font-medium hover:underline text-brand-orange'
          >
            Join Monkeys
          </Link>
        </div>
      </div>
    </>
  );
}
