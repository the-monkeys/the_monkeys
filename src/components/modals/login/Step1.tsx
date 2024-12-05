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
    <ModalContent className='space-y-3'>
      <Button
        variant='brand'
        className='w-full flex'
        onClick={(e) => handleSubmit(e)}
      >
        <Icon name='RiMail' type='Fill' />
        <p className='flex-1'>Login with Email</p>
      </Button>

      <Button variant='outline' disabled className='w-full flex'>
        <Icon name='RiGoogle' type='Fill' />
        <p className='flex-1'>Coming Soon</p>
      </Button>

      {/* <Button variant='outline' disabled className='w-full flex'>
        <Icon name='RiMeta' type='Fill' />
        <p className='flex-1'>Coming Soon</p>
      </Button> */}

      <div className='flex justify-center items-center gap-1'>
        <p className='font-dm_sans text-sm opacity-80'>New user?</p>

        <button
          className='font-dm_sans text-sm hover:text-brand-orange'
          onClick={(e) => handleRegister(e)}
        >
          Join Monkeys
        </button>
      </div>
    </ModalContent>
  );
};

export default Step1;
