import { FC, useState } from 'react';

import Button from '@/components/button';
import Icon from '@/components/icon/Icon';
import Input from '@/components/input';
import { signupSteps } from '@/constants/modal';

import ModalContent from '../layout/ModalContent';
import { SignupStep } from './SignupModal';

type Step3Props = {
  setLoginStep: React.Dispatch<React.SetStateAction<SignupStep>>;
};

const Step3: FC<Step3Props> = ({ setLoginStep }) => {
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

    setLoginStep(signupSteps[3]);
  };

  const handlePreviousStep = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setLoginStep(signupSteps[1]);
  };

  return (
    <ModalContent className='flex flex-col justify-center gap-2 px-4'>
      <form className='flex flex-col gap-2'>
        <Input
          variant='border'
          placeholderText='Enter email address'
          label='Email'
          setInputText={setEmail}
          className='flex-1'
          type='email'
        />

        {inputError && (
          <div className='flex items-center gap-2 pl-1 font-jost text-xs text-alert-red sm:text-sm'>
            <Icon name='RiErrorWarningFill' size={16} />
            <p>Enter correct email address. Try again.</p>
          </div>
        )}

        <div className='flex gap-2 items-center mt-4'>
          <Button
            className='w-full'
            title='Previous'
            variant='secondary'
            onClick={(e) => handlePreviousStep(e)}
          />
          <Button
            className='w-full'
            title='Next'
            variant='primary'
            onClick={(e) => handleSubmit(e)}
          />
        </div>
      </form>
    </ModalContent>
  );
};

export default Step3;
