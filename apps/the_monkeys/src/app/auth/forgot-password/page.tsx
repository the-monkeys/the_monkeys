import Link from 'next/link';

import {
  FormHeader,
  FormHeading,
  FormSubheading,
} from '../components/formHeading';
import ForgotPasswordForm from '../components/forms/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <>
      <FormHeader>
        <FormHeading heading='Trouble Logging In?' />
        <FormSubheading subheading='Enter your email to reset your password.' />
      </FormHeader>

      <div className='flex flex-col gap-4'>
        <ForgotPasswordForm />

        <div className='mt-4 text-center'>
          <span>Go back to </span>

          <Link
            href='/auth/login'
            className='font-medium hover:underline text-brand-orange'
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
