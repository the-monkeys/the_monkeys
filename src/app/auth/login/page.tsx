'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { LoginFormSkeleton } from '@/components/skeletons/formSkeleton';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/constants/api';
import useAuth from '@/hooks/auth/useAuth';

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
      <div className='flex justify-end'>
        <LinksRedirectArrow link='/feed'>
          <p className='font-dm_sans font-medium'>Monkeys Showcase</p>
        </LinksRedirectArrow>
      </div>

      <FormHeader>
        <FormHeading heading='Welcome Back' />
        <FormSubheading subheading='Log in to continue your journey' />
      </FormHeader>

      <div className='flex flex-col gap-4'>
        {isLoading || isFetching ? (
          <LoginFormSkeleton />
        ) : (
          <>
            <LoginForm />

            <Button
              variant='secondary'
              className='w-full flex items-center gap-2'
              asChild
            >
              <a href={API_URL + '/auth/google/login'}>
                <Icon name='RiGoogle' type='Fill' />
                <p>Login with Google</p>
              </a>
            </Button>

            <div className='mt-6 text-center'>
              <span className='font-dm_sans'>New to Monkeys? </span>
              <Link
                href='/auth/register'
                className='font-dm_sans hover:underline text-brand-orange'
              >
                Join Monkeys
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
