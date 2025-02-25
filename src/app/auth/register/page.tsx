'use client';

import Link from 'next/link';

import {
  FormHeader,
  FormHeading,
  FormSubheading,
} from '../components/formHeading';
import RegisterUserForm from '../components/forms/RegisterUserForm';

export default function Register() {
  return (
    <>
      <FormHeader className='mt-8'>
        <FormHeading heading='Get Started' />
        <FormSubheading subheading='Create an account and join us today' />
      </FormHeader>

      <div className='flex flex-col gap-4'>
        <RegisterUserForm />

        <div className='mt-4 text-center'>
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
