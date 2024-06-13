import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import { signupSteps } from '@/constants/modal';

import ModalContent from '../layout/ModalContent';
import { SignupStep } from './SignupModal';

const Step1 = ({
  setSignupStep,
}: {
  setSignupStep: React.Dispatch<React.SetStateAction<SignupStep>>;
}) => {
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setSignupStep(signupSteps[1]);
  };

  return (
    <ModalContent className='space-y-4'>
      <Button className='w-full flex' onClick={(e) => handleSubmit(e)}>
        <Icon name='RiMail' type='Fill' />
        <p className='flex-1'>Sign up using Email</p>
      </Button>

      <Button variant='outline' disabled className='w-full flex'>
        <Icon name='RiGoogle' type='Fill' />
        <p className='flex-1'>Coming Soon</p>
      </Button>

      <Button variant='outline' disabled className='w-full flex'>
        <Icon name='RiMeta' type='Fill' />
        <p className='flex-1'>Coming Soon</p>
      </Button>
    </ModalContent>
  );
};

export default Step1;
