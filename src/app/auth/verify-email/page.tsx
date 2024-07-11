import React from 'react';

import PageHeading from '@/components/pageHeading';
import VerifyEmailStatus from '../components/VerifyEmailStatus';

const VerifyEmailPage = () => {
  return (
    <>
      <PageHeading heading='Email Verification' />

      <VerifyEmailStatus />
    </>
  );
};

export default VerifyEmailPage;
