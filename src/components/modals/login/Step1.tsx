import Link from 'next/link';

import Icon from '@/components/icon/icon';
import { Button } from '@/components/ui/button';
import { loginSteps } from '@/constants/modal';

import ModalContent from '../layout/ModalContent';
import { LoginStep } from './LoginModal';

const LoginStep1 = ({
  setLoginStep,
}: {
  setLoginStep: React.Dispatch<React.SetStateAction<LoginStep>>;
}) => {
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setLoginStep(loginSteps[1]);
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

      <p className='text-center font-jost text-sm'>
        Don't have an account?
        <Link className='text-primary-monkeyOrange' href='#'>
          {' '}
          Join Monkeys
        </Link>
      </p>
    </ModalContent>
  );
};

export default LoginStep1;
