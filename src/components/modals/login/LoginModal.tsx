'use client';

import { useState } from 'react';

import { loginSteps } from '@/constants/modal';

import Modal from '..';
import ModalFooter from '../layout/ModalFooter';
import ModalHeader from '../layout/ModalHeader';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

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
    else if (loginStep.id === 3) return <Step3 setLoginStep={setLoginStep} />;
    else return <Step4 setLoginStep={setLoginStep} />;
  };

  return (
    <Modal setModal={setModal}>
      <ModalHeader>
        <h1 className='font-arvo text-2xl sm:text-3xl text-center'>
          {loginStep?.heading}
        </h1>

        {loginStep.subHeading && (
          <p className='font-dm_sans text-sm sm:text-base opacity-80 text-center'>
            {loginStep.subHeading}
          </p>
        )}
      </ModalHeader>

      {handleLoginStep()}

      <ModalFooter>
        <p className='font-roboto text-xs text-foreground-dark dark:text-foreground-light text-center'>
          By logging in to Monkeys, you agree to our Terms and Policies.
        </p>
      </ModalFooter>
    </Modal>
  );
};

export default LoginModal;
