import Link from 'next/link';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';

import ForgotPasswordForm from '../components/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <>
      <PageHeader className='mt-8'>
        <PageHeading heading='Forgot Password' />
        <PageSubheading subheading='Enter your email to reset your password' />
      </PageHeader>
      <Container className='max-w-screen-sm my-8 px-3 flex flex-col gap-8'>
        <ForgotPasswordForm />

        <div className='mt-4 text-center'>
          <span className='font-dm_sans'>Go back to </span>
          <Link
            href='/auth/login'
            className='font-dm_sans hover:underline opacity-80 text-brand-orange'
          >
            Login
          </Link>
        </div>
      </Container>
    </>
  );
}
