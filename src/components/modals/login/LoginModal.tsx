'use client';

import React, { FC } from 'react';
import Modal from '..';
import ModalHeader from '../layout/ModalHeader';
import ModalContent from '../layout/ModalContent';
import ModalFooter from '../layout/ModalFooter';
import Button from '../../button';
import Link from 'next/link';
import Step1 from './Step1';
import Step2 from './Step2';

type LoginModalProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginModal: FC<LoginModalProps> = ({ setModal }) => {
  return (
    <Modal setModal={setModal}>
      <ModalHeader showHeading setModal={setModal} heading='Welcome Back' />

      {/* <Step1 /> */}
      <Step2 />

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
