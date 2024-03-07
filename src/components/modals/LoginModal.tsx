'use client';

import React, { FC } from 'react';
import Modal from '.';
import ModalHeader from './layout/ModalHeader';
import ModalContent from './layout/ModalContent';
import ModalFooter from './layout/ModalFooter';
import Button from '../button';

type LoginModalProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginModal: FC<LoginModalProps> = ({ setModal }) => {
  return (
    <Modal setModal={setModal}>
      <ModalHeader showHeading setModal={setModal} heading='Welcome Back' />

      <ModalContent className='flex flex-col justify-center gap-2'>
        <p className='text-center font-jost text-sm'>
          Don't have an account?
          <span className='text-primary-monkeyOrange'> Join Monkeys</span>
        </p>

        <div className='px-4'>
          <Button
            className='w-full'
            title='Login with Google'
            variant='shallow'
            startIcon
            iconName='RiGoogleFill'
          />

          <div className='flex items-center justify-center py-2'>
            <div className='w-12 border-b-1 border-secondary-lightGrey/25'></div>
            <p className='px-2 text-center font-josefin_Sans text-sm'>Or</p>
            <div className='w-12 border-b-1 border-secondary-lightGrey/25'></div>
          </div>

          <Button
            className='w-full'
            title='Login with Email'
            variant='primary'
            startIcon
            iconName='RiMailFill'
          />
        </div>
      </ModalContent>

      <ModalFooter>
        <p className='text-center font-jost text-xs'>
          By logging in or signing up using above options, you agree to Monkey's{' '}
          <span className='underline'>Terms & Conditions </span>and{' '}
          <span className='underline'>Privacy Policy.</span>
        </p>
      </ModalFooter>
    </Modal>
  );
};

export default LoginModal;
