import React, { FC, useState } from 'react';

import Button from '@/components/button';
import Icon from '@/components/icon';
import Input from '@/components/input';

import ModalContent from '../layout/ModalContent';
import { LoginStep } from './LoginModal';
import { loginSteps } from './loginSteps';

type Step2Props = {
  setLoginStep: React.Dispatch<React.SetStateAction<LoginStep>>;
};

const Step2: FC<Step2Props> = ({ setLoginStep }) => {
  const [email, setEmail] = useState<string>('');
  const [inputError, setInputError] = useState<boolean>(false);

  const validateEmail = (inputEmail: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setInputError(true);
      return;
    }

    setLoginStep(loginSteps[2]);
  };

  return (
    <ModalContent className='flex flex-col justify-center px-4'>
      <form className='flex flex-col'>
        <Input
          className='w-full'
          label='Email'
          placeholderText='enter email'
          variant='border'
          setInputText={setEmail}
          type='email'
        />

        {inputError && (
          <div className='flex items-center gap-2 pl-1 font-jost text-xs text-alert-red sm:text-sm'>
            <Icon name='RiErrorWarningFill' size={16} />
            <p>Couldn't find any matching email. Try again.</p>
          </div>
        )}

        <Button
          title='Next'
          variant='primary'
          className='mt-4'
          onClick={(e) => handleSubmit(e)}
        />
      </form>
    </ModalContent>
  );
};

export default Step2;
