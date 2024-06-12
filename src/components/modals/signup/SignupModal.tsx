import { useState } from 'react';

import { signupSteps } from '@/constants/modal';

import Modal from '..';
import ModalFooter from '../layout/ModalFooter';
import ModalHeader from '../layout/ModalHeader';
import SignupStep1 from './Step1';
import SignupStep2 from './Step2';

export type SignupStep = {
  id: number;
  heading: string;
  subHeading?: string;
};

const SignupModal = ({
  setModal,
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [signupStep, setSignupStep] = useState<SignupStep>(signupSteps[0]);

  const handleSignupStep = () => {
    if (signupStep.id === 1)
      return <SignupStep1 setSignupStep={setSignupStep} />;
    else return <SignupStep2 setSignupStep={setSignupStep} />;
  };

  return (
    <Modal setModal={setModal}>
      <ModalHeader>
        <h1 className='font-playfair_Display text-2xl sm:text-3xl text-center font-semibold'>
          {signupStep?.heading}
        </h1>

        {signupStep.subHeading && (
          <p className='mt-2 font-jost text-sm sm:text-base opacity-75 text-center'>
            {signupStep.subHeading}
          </p>
        )}
      </ModalHeader>

      {handleSignupStep()}

      <ModalFooter>
        <p className='text-center font-jost text-sm opacity-75'>
          By signing up to Monkeys, you agree to our Terms and Policies.
        </p>
      </ModalFooter>
    </Modal>
  );
};

export default SignupModal;
