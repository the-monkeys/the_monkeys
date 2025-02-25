import React from 'react';

import {
  FormHeader,
  FormHeading,
  FormSubheading,
} from '../components/formHeading';
import { ResetPasswordForm } from '../components/forms/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <>
      <FormHeader className='mt-8'>
        <FormHeading heading='Set a New Password' />
        <FormSubheading subheading='Choose a strong password to secure your account' />
      </FormHeader>

      <ResetPasswordForm />
    </>
  );
};

export default ResetPasswordPage;
