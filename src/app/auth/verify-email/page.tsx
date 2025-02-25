import React from 'react';

import { VerifyEmailStatus } from '../components/VerifyEmailStatus';
import {
  FormHeader,
  FormHeading,
  FormSubheading,
} from '../components/formHeading';

const VerifyEmailPage = () => {
  return (
    <>
      <FormHeader className='mt-8'>
        <FormHeading heading='Verify Your Email' />
        <FormSubheading subheading='Check your inbox to confirm your email address' />
      </FormHeader>

      <VerifyEmailStatus />
    </>
  );
};

export default VerifyEmailPage;
