import React from 'react';

import { PageHeader, PageHeading } from '@/components/layout/pageHeading';

import { VerifyEmailStatus } from '../components/VerifyEmailStatus';

const VerifyEmailPage = () => {
  return (
    <>
      <PageHeader>
        <PageHeading heading='Email Verification' />
      </PageHeader>

      <VerifyEmailStatus />
    </>
  );
};

export default VerifyEmailPage;
