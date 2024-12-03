import Link from 'next/link';

import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import { loginSteps } from '@/constants/modal';

import ModalContent from '../layout/ModalContent';
import { LoginStep } from './LoginModal';

const Step1 = ({
  setLoginStep,
}: {
  setLoginStep: React.Dispatch<React.SetStateAction<LoginStep>>;
}) => {
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setLoginStep(loginSteps[1]);
  };
  const handleRegister = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    setLoginStep(loginSteps[3]);
  };

  return (
    <ModalContent className='space-y-4'>
      <Button className='w-full flex' onClick={(e) => handleSubmit(e)}>
        <Icon name='RiMail' type='Fill' />
        <p className='flex-1'>Login with Email</p>
      </Button>

      <Button variant='outline' disabled className='w-full flex'>
        <Icon name='RiGoogle' type='Fill' />
        <p className='flex-1'>Coming Soon</p>
      </Button>

      <Button variant='outline' disabled className='w-full flex'>
        <Icon name='RiMeta' type='Fill' />
        <p className='flex-1'>Coming Soon</p>
      </Button>

      <p className='text-center font-roboto text-sm'>
        Don't have an account?
        <span
          className='text-primary-monkeyOrange cursor-pointer'
          onClick={(e) => handleRegister(e)}
        >
          {' '}
          Join Monkeys
        </span>
      </p>
    </ModalContent>
  );
};

export default Step1;
