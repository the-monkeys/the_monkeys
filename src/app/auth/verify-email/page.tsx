import React from 'react';

import { PageHeader, PageHeading } from '@/components/layout/pageHeading';

import { VerifyEmailStatus } from '../components/VerifyEmailStatus';

const VerifyEmailPage = () => {
  return (
    <>
      <PageHeader>
        <PageHeading heading='Email Verification' className='py-1' />
      </PageHeader>

      <VerifyEmailStatus />
    </>
  );
};

export default VerifyEmailPage;
