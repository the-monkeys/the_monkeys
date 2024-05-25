'use client';

import React from 'react';

import Button from '@/components/button';

const DeleteAccount = () => {
  return (
    <div className='w-full'>
      <p className='font-josefin_Sans text-lg'>Deactivate Your Account</p>

      <p className='font-light font-jost opacity-75'>
        This action will erase all your personal data permanently and cannot be
        undone.
      </p>

      <Button
        variant='primary'
        title='Delete your Account'
        className='mt-4 bg-primary-monkeyWhite text-primary-monkeyBlack hover:text-primary-monkeyBlack'
      />
    </div>
  );
};

export default DeleteAccount;
