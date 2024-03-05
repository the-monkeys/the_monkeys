import Button from '@/components/button';
import ModalContent from '../layout/ModalContent';
import Link from 'next/link';
import Input from '@/components/input';
import React from 'react';
import Checkbox from '@/components/input/Checkbox';

const Step2 = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <ModalContent className='flex flex-col justify-center'>
      <form className='flex flex-col gap-2 px-4'>
        <div className='flex flex-col gap-4'>
          <Input
            className='w-full'
            label='Email'
            placeholderText='enter email'
            variant='border'
            setInputText={setEmail}
            type='email'
          />
          <Input
            className='w-full'
            label='Password'
            placeholderText='enter password'
            variant='border'
            setInputText={setPassword}
            type='password'
          />
        </div>
        <div className='flex items-center justify-between pb-8'>
          <Checkbox />
          <Link
            className='font-jost text-sm opacity-75 hover:opacity-100'
            href='#'
          >
            Forgot Password?
          </Link>
        </div>
        <Button title='Login' variant='primary' />
      </form>
    </ModalContent>
  );
};

export default Step2;
