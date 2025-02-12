import React from 'react';

import { PageHeader, PageHeading } from '@/components/layout/pageHeading';

import { ResetPasswordForm } from '../components/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <>
      <PageHeader>
        <PageHeading heading='Reset Password' />
      </PageHeader>

      <ResetPasswordForm />
    </>
  );
};

export default ResetPasswordPage;
