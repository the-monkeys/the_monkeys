'use client';

import React, { FC, useState } from 'react';

import Modal from '@/components/modals';
import ModalFooter from '@/components/modals/layout/ModalFooter';
import ModalHeader from '@/components/modals/layout/ModalHeader';
import Step1 from '@/components/modals/login/Step1';
import Step2 from '@/components/modals/login/Step2';
import Step3 from '@/components/modals/login/Step3';
import { loginSteps } from '@/components/modals/login/loginSteps';

export type LoginStep = {
  id: number;
  heading: string;
  subHeading?: string;
};

type LoginModalProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginModal: FC<LoginModalProps> = ({ setModal }) => {
  const [loginStep, setLoginStep] = useState<LoginStep>(loginSteps[0]);

  const handleLoginStep = () => {
    if (loginStep.id === 1) return <Step1 setLoginStep={setLoginStep} />;
    else if (loginStep.id === 2) return <Step2 setLoginStep={setLoginStep} />;
    else return <Step3 setLoginStep={setLoginStep} />;
  };

  return (
    <Modal setModal={setModal}>
      <ModalHeader
        showHeading
        setModal={setModal}
        heading={loginStep?.heading}
        subHeading={loginStep?.subHeading}
      />

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
