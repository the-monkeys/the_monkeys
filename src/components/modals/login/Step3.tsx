import React, { FC, useState } from 'react';

import Link from 'next/link';

import Button from '@/components/button';
import Icon from '@/components/icon/Icon';
import Input from '@/components/input';
import Checkbox from '@/components/input/Checkbox';
import { loginSteps } from '@/constants/modal';

import ModalContent from '../layout/ModalContent';
import { LoginStep } from './LoginModal';

type Step3Props = {
  setLoginStep: React.Dispatch<React.SetStateAction<LoginStep>>;
};

const Step3: FC<Step3Props> = ({ setLoginStep }) => {
  const [password, setPassword] = useState<string>('');
  const [inputError, setInputError] = useState<boolean>(false);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setLoginStep(loginSteps[0]);
  };

  const handlePreviousStep = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setLoginStep(loginSteps[2]);
  };

  return (
    <ModalContent className='flex flex-col justify-center px-4'>
      <form className='flex flex-col'>
        <Input
          className='w-full'
          label='Password'
          placeholderText='enter password'
          variant='border'
          setInputText={setPassword}
          type='password'
        />

        {inputError && (
          <div className='flex items-center gap-2 pl-1 font-jost text-xs text-alert-red sm:text-sm'>
            <Icon name='RiErrorWarningFill' size={16} />
            <p>Wrong password. Try again or click 'Forgot password'.</p>
          </div>
        )}

        <div className='mt-2 flex items-center justify-between pl-1'>
          <Checkbox title='Remember Me' />

          <Link
            className='font-jost text-sm opacity-75 hover:opacity-100'
            href='#'
          >
            Forgot Password?
          </Link>
        </div>

        <div className='flex gap-2 items-center mt-4'>
          <Button
            className='w-full'
            title='Previous'
            variant='secondary'
            onClick={(e) => handlePreviousStep(e)}
          />
          <Button
            className='w-full'
            title='Login'
            variant='primary'
            onClick={(e) => handleSubmit(e)}
          />
        </div>
      </form>
    </ModalContent>
  );
};

export default Step3;
