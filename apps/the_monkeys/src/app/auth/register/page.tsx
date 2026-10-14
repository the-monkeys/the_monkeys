'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import {
  loginHref,
  rememberAuthCallback,
  safeCallbackPath,
} from '@/lib/authRedirect';

import {
  FormHeader,
  FormHeading,
  FormSubheading,
} from '../components/formHeading';
import RegisterUserForm from '../components/forms/RegisterUserForm';

export default function Register() {
  const callbackURL = safeCallbackPath(useSearchParams().get('callbackURL'));

  useEffect(() => {
    rememberAuthCallback(callbackURL);
  }, [callbackURL]);

  return (
    <>
      <FormHeader>
        <FormHeading heading='Get Started' />
        <FormSubheading subheading='Register today and start your journey with Monkeys.' />
      </FormHeader>

      <div className='flex flex-col gap-4'>
        <RegisterUserForm />

        <div className='mt-8 text-center'>
          <span>Already have an account? </span>

          <Link
            href={loginHref(callbackURL)}
            className='font-medium hover:underline text-brand-orange'
          >
            Login instead
          </Link>
        </div>
      </div>
    </>
  );
}
