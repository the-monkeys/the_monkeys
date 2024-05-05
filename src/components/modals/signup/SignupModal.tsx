import { FC, useState } from 'react';

import { signupSteps } from '@/constants/modal';

import Modal from '..';
import ModalFooter from '../layout/ModalFooter';
import ModalHeader from '../layout/ModalHeader';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

export type SignupStep = {
  id: number;
  heading: string;
  subHeading?: string;
};

type SignupModalProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignupModal: FC<SignupModalProps> = ({ setModal }) => {
  const [signupStep, setSignupStep] = useState<SignupStep>(signupSteps[0]);

  const handleSignupStep = () => {
    if (signupStep.id === 1) return <Step1 setLoginStep={setSignupStep} />;
    else if (signupStep.id === 2) return <Step2 setLoginStep={setSignupStep} />;
    else if (signupStep.id === 3) return <Step3 setLoginStep={setSignupStep} />;
    else return <Step4 setLoginStep={setSignupStep} />;
  };

  return (
    <Modal setModal={setModal}>
      <ModalHeader
        showHeading
        heading={signupStep.heading}
        subHeading={signupStep.subHeading}
      />

      {handleSignupStep()}

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

export default SignupModal;
