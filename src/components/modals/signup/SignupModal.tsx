import { FC, useState } from 'react';

import Modal from '..';
import ModalFooter from '../layout/ModalFooter';
import ModalHeader from '../layout/ModalHeader';
import Step1 from './Step1';
import { signupSteps } from './signupSteps';

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
    // else if (loginStep === 2) return <Step2 setLoginStep={setLoginStep} />;
    // else return <Step3 setLoginStep={setLoginStep} />;
  };

  return (
    <Modal setModal={setModal}>
      <ModalHeader
        showHeading
        setModal={setModal}
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
