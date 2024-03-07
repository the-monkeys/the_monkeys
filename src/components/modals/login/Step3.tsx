import Button from '@/components/button';
import ModalContent from '../layout/ModalContent';
import Link from 'next/link';
import Input from '@/components/input';
import React, { FC } from 'react';
import Checkbox from '@/components/input/Checkbox';
import Icon from '@/components/icon';

type Step3Props = {
  setLoginStep: React.Dispatch<React.SetStateAction<number>>;
};

const Step3: FC<Step3Props> = ({ setLoginStep }) => {
  const [password, setPassword] = React.useState<string>('');
  const [inputError, setInputError] = React.useState<boolean>(false);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setLoginStep(1);
  };

  return (
    <ModalContent className='flex flex-col justify-center'>
      <form className='flex flex-col px-4'>
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
          <Checkbox />
          <Link
            className='font-jost text-sm opacity-75 hover:opacity-100'
            href='#'
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          title='Login'
          variant='primary'
          className='mt-4'
          onClick={(e) => handleSubmit(e)}
        />
      </form>
    </ModalContent>
  );
};

export default Step3;
