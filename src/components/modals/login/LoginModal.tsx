'use client';

import React, { FC, useState } from 'react';
import Modal from '..';
import ModalHeader from '../layout/ModalHeader';
import ModalFooter from '../layout/ModalFooter';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

type LoginModalProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginModal: FC<LoginModalProps> = ({ setModal }) => {
  const [loginStep, setLoginStep] = useState<number>(1);

  const handleLoginStep = () => {
    if (loginStep === 1) return <Step1 setLoginStep={setLoginStep} />;
    else if (loginStep === 2) return <Step2 setLoginStep={setLoginStep} />;
    else return <Step3 setLoginStep={setLoginStep} />;
  };

  return (
    <Modal setModal={setModal}>
      <ModalHeader showHeading setModal={setModal} heading='Welcome Back' />

      {handleLoginStep()}

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
