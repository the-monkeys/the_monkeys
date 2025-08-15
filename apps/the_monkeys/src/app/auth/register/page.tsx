'use client';

import Link from 'next/link';

import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';

import {
  FormHeader,
  FormHeading,
  FormSubheading,
} from '../components/formHeading';
import RegisterUserForm from '../components/forms/RegisterUserForm';

export default function Register() {
  return (
    <>
      <div className='flex justify-end'>
        <LinksRedirectArrow link='/feed'>
          <p className='font-dm_sans font-medium'>Monkeys Feed</p>
        </LinksRedirectArrow>
      </div>

      <FormHeader>
        <FormHeading heading='Get Started' />
        <FormSubheading subheading='Create an account and join us today' />
      </FormHeader>

      <div className='flex flex-col gap-4'>
        <RegisterUserForm />

        <div className='mt-6 text-center'>
          <span className='font-dm_sans'>Already have an account? </span>
          <Link
            href='/auth/login'
            className='font-dm_sans hover:underline text-brand-orange'
          >
            Login instead
          </Link>
        </div>
      </div>
    </>
  );
}
