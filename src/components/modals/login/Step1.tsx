import { FC } from 'react';

import Link from 'next/link';

import Button from '@/components/button';

import ModalContent from '../layout/ModalContent';

type Step1Props = {
  setLoginStep: React.Dispatch<React.SetStateAction<number>>;
};

const Step1: FC<Step1Props> = ({ setLoginStep }) => {
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setLoginStep(2);
  };

  return (
    <ModalContent className='flex flex-col justify-center gap-2'>
      <div className='px-4'>
        <Button
          className='w-full'
          title='Login with Email'
          variant='primary'
          startIcon
          iconName='RiMailFill'
          onClick={(e) => handleSubmit(e)}
        />

        <div className='flex items-center justify-center py-2'>
          <div className='w-12 border-b-1 border-secondary-lightGrey/25'></div>
          <p className='px-2 text-center font-josefin_Sans text-sm'>Or</p>
          <div className='w-12 border-b-1 border-secondary-lightGrey/25'></div>
        </div>

        <Button
          className='w-full'
          title='Coming Soon'
          variant='shallow'
          startIcon
          iconName='RiGoogleFill'
          disabled
        />
      </div>
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

export default Step1;
