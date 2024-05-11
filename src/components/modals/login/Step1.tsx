import { FC } from 'react';

import Link from 'next/link';

import Button from '@/components/button';
import { loginSteps } from '@/constants/modal';

import ModalContent from '../layout/ModalContent';
import { LoginStep } from './LoginModal';

type Step1Props = {
  setLoginStep: React.Dispatch<React.SetStateAction<LoginStep>>;
};

const Step1: FC<Step1Props> = ({ setLoginStep }) => {
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setLoginStep(loginSteps[1]);
  };

  return (
    <ModalContent className='flex flex-col justify-center gap-2 px-4'>
      <Button
        className='w-full'
        title='Login with Email'
        variant='primary'
        startIcon
        iconName='RiMailFill'
        onClick={(e) => handleSubmit(e)}
      />

      <div className='flex items-center justify-center py-2'>
        <div className='w-12 border-b-1 border-secondary-lightGrey/25'></div>
        <p className='px-2 text-center font-josefin_Sans text-sm'>Or</p>
        <div className='w-12 border-b-1 border-secondary-lightGrey/25'></div>
      </div>

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

      <p className='text-center font-jost text-sm'>
        Don't have an account?
        <Link className='text-primary-monkeyOrange' href='#'>
          {' '}
          Join Monkeys
        </Link>
      </p>
    </ModalContent>
  );
};

export default Step1;
