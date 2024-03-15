import { FC, useState } from 'react';

import Button from '@/components/button';
import Input from '@/components/input';

import ModalContent from '../layout/ModalContent';
import { SignupStep } from './SignupModal';
import { signupSteps } from './signupSteps';

type Step2Props = {
  setLoginStep: React.Dispatch<React.SetStateAction<SignupStep>>;
};

const Step2: FC<Step2Props> = ({ setLoginStep }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setLoginStep(signupSteps[2]);
  };

  return (
    <ModalContent className='flex flex-col justify-center gap-2 px-4'>
      <form className='flex flex-col gap-2'>
        <Input
          variant='border'
          placeholderText='Enter first name'
          label='First Name'
          setInputText={setFirstName}
          className='flex-1'
        />

        <Input
          variant='border'
          placeholderText='Enter last name'
          label='Last Name'
          setInputText={setLastName}
          className='flex-1'
        />

        <Button
          className='mt-2 w-full'
          title='Next'
          variant='primary'
          onClick={(e) => handleSubmit(e)}
        />
      </form>
    </ModalContent>
  );
};

export default Step2;
