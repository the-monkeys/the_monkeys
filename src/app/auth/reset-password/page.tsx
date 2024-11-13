import React from 'react';

import { PageHeader, PageHeading } from '@/components/pageHeading';

import ResetPasswordForm from '../components/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <>
      <PageHeader>
        <PageHeading heading='Reset Password' className='py-1' />
      </PageHeader>

      <ResetPasswordForm />
    </>
  );
};

export default ResetPasswordPage;
