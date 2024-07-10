import React from 'react';

import PageHeading from '@/components/pageHeading';

import ResetPasswordForm from '../components/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <>
      <PageHeading heading='Reset Password' />

      <ResetPasswordForm />
    </>
  );
};

export default ResetPasswordPage;
