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
      <FormHeader>
        <FormHeading heading='Get Started' />
        <FormSubheading subheading='Register today and start your journey with Monkeys.' />
      </FormHeader>

      <div className='flex flex-col gap-4'>
        <RegisterUserForm />

        <div className='mt-8 text-center'>
          <span>Already have an account? </span>

          <Link
            href='/auth/login'
            className='font-medium hover:underline text-brand-orange'
          >
            Login instead
          </Link>
        </div>
      </div>
    </>
  );
}
