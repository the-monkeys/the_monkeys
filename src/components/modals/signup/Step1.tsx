import { FC, useState } from 'react';

import Button from '@/components/button';
import Input from '@/components/input';

import ModalContent from '../layout/ModalContent';
import { SignupStep } from './SignupModal';
import { signupSteps } from './signupSteps';

type Step1Props = {
  setLoginStep: React.Dispatch<React.SetStateAction<SignupStep>>;
};

const Step1: FC<Step1Props> = ({ setLoginStep }) => {
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setLoginStep(signupSteps[1]);
  };

  return (
    <ModalContent className='flex flex-col justify-center gap-4 px-4'>
      <Button
        className='w-full'
        title='Signup with Email'
        variant='primary'
        startIcon
        iconName='RiMailFill'
        onClick={(e) => handleSubmit(e)}
      />

      <Button
        className='w-full'
        title='Coming soon'
        variant='shallow'
        startIcon
        iconName='RiGoogleFill'
        disabled
      />

      <Button
        className='w-full'
        title='Coming soon'
        variant='shallow'
        startIcon
        iconName='RiInstagramFill'
        disabled
      />
    </ModalContent>
  );
};

export default Step1;
