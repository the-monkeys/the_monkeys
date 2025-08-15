import Link from 'next/link';

import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';

import {
  FormHeader,
  FormHeading,
  FormSubheading,
} from '../components/formHeading';
import ForgotPasswordForm from '../components/forms/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <>
      <div className='flex justify-end'>
        <LinksRedirectArrow link='/feed'>
          <p className='font-dm_sans font-medium'>Monkeys Feed</p>
        </LinksRedirectArrow>
      </div>

      <FormHeader>
        <FormHeading heading='Trouble Logging In?' />
        <FormSubheading subheading='Enter your email to reset your password' />
      </FormHeader>

      <div className='flex flex-col gap-4'>
        <ForgotPasswordForm />

        <div className='mt-6 text-center'>
          <span className='font-dm_sans'>Go back to </span>
          <Link
            href='/auth/login'
            className='font-dm_sans hover:underline text-brand-orange'
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
