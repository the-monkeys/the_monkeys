import { FC, useState } from 'react';

import Button from '@/components/button';
import Icon from '@/components/icon/Icon';
import Input from '@/components/input';
import { signupSteps } from '@/constants/modal';

import SetPassword from '../SetPassword';
import ModalContent from '../layout/ModalContent';
import { SignupStep } from './SignupModal';

type Step4Props = {
  setLoginStep: React.Dispatch<React.SetStateAction<SignupStep>>;
};

const Step4: FC<Step4Props> = ({ setLoginStep }) => {
  const [password, setPassword] = useState<string>('');
  const [criteriaCount, setCriteriaCount] = useState<number>(0);
  const [inputError, setInputError] = useState<boolean>(false);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (criteriaCount !== 3) {
      setInputError(true);
      return;
    }

    setLoginStep(signupSteps[0]);
  };

  const handlePreviousStep = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setLoginStep(signupSteps[2]);
  };

  return (
    <ModalContent className='flex flex-col justify-center gap-2 px-4'>
      <form className='flex flex-col gap-2'>
        <Input
          variant='border'
          placeholderText='Enter password'
          label='Password'
          setInputText={setPassword}
          className='flex-1'
          type='password'
        />

        {inputError && (
          <div className='flex items-center gap-2 pl-1 font-jost text-xs text-alert-red sm:text-sm'>
            <Icon name='RiErrorWarningFill' size={16} />
            <p>Please ensure your password meets the above criteria.</p>
          </div>
        )}

        <SetPassword password={password} setCriteriaCount={setCriteriaCount} />

        <div className='flex gap-2 items-center mt-4'>
          <Button
            className='w-full'
            title='Previous'
            variant='secondary'
            onClick={(e) => handlePreviousStep(e)}
          />
          <Button
            className='w-full'
            title='Create'
            variant='primary'
            onClick={(e) => handleSubmit(e)}
          />
        </div>
      </form>
    </ModalContent>
  );
};

export default Step4;
