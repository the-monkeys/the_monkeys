'use client';

import { useState } from 'react';

import { loginSteps } from '@/constants/modal';

import Modal from '..';
import ModalFooter from '../layout/ModalFooter';
import ModalHeader from '../layout/ModalHeader';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';

export type LoginStep = {
  id: number;
  heading: string;
  subHeading?: string;
};

const LoginModal = ({
  setModal,
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loginStep, setLoginStep] = useState<LoginStep>(loginSteps[0]);

  const handleLoginStep = () => {
    if (loginStep.id === 1) return <Step1 setLoginStep={setLoginStep} />;
    else if (loginStep.id === 2) return <Step2 setLoginStep={setLoginStep} />;
    else return <Step3 setLoginStep={setLoginStep} />;
  };

  return (
    <Modal setModal={setModal}>
      <ModalHeader>
        <h1 className='font-playfair_Display text-2xl sm:text-3xl text-center font-semibold'>
          {loginStep?.heading}
        </h1>

        {loginStep.subHeading && (
          <p className='mt-2 font-jost text-sm sm:text-base opacity-75 text-center'>
            {loginStep.subHeading}
          </p>
        )}
      </ModalHeader>

      {handleLoginStep()}

      <ModalFooter>
        <p className='text-center font-jost text-sm opacity-75'>
          By logging in to Monkeys, you agree to our Terms and Policies.
        </p>
      </ModalFooter>
    </Modal>
  );
};

export default LoginModal;
