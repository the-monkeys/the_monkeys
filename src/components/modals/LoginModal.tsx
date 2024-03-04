'use client';

import React, { FC } from 'react';
import Modal from '.';
import ModalHeader from './layout/ModalHeader';
import ModalContent from './layout/ModalContent';
import ModalFooter from './layout/ModalFooter';
import Button from '../button';
import Loginbtn from './Loginbtn';
import Input from '@/components/input';

type LoginModalProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginModal: FC<LoginModalProps> = ({ setModal }) => {
  return (
    <Modal setModal={setModal}>
      <ModalHeader showHeading setModal={setModal} />
      <div>
        <p className='pt-20 text-center'>
          Don't have an account?
          <span className='text-primary-monkeyOrange'> Join Monkeys</span>
        </p>
      </div>
      <div>
        <div className='flex justify-center'>
          <Loginbtn title='Login with Google' />
        </div>
        <div className='flex items-center justify-center gap-5'>
          <div className='mr-2 h-12 rotate-90 border-l-1'></div>
          <p className='text-center'>Or</p>
          <div className='ml-2 h-12 rotate-90 border-r-1'></div>
        </div>
        <div className='flex justify-center'>
          <Loginbtn
            iconName='RiMailFill'
            title='Login with Email'
            className='bg-primary-monkeyBlack text-primary-monkeyWhite dark:bg-primary-monkeyWhite dark:text-primary-monkeyBlack'
          />
        </div>
      </div>

      <div className='md- flex px-10 pt-20 text-center'>
        <span className='text-xs'>
          {' '}
          By logging in or signing up using above options, you agree to Monkey's{' '}
          <span className='underline'>Terms & Conditions </span>and{' '}
          <span className='underline'>Privacy Policy.</span>
        </span>
      </div>
    </Modal>
  );
};

export default LoginModal;
