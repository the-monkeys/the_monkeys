'use client';

import React from 'react';

import Button from '@/components/button';

const DeleteAccount = () => {
  return (
    <div>
      <div className='grid grid-cols-[25%_70%] px-4 sm:px-6 lg:px-8'>
        <div className='font-josefin_Sans text-xl text-alert-red'>
          Delete account
        </div>
        <div>
          <p className='font-josefin_Sans text-base text-primary-monkeyWhite '>
            Deactivate Your Account
          </p>
          <p className='font-jost text-secondary-mute'>
            When you delete your account on Monkeys, all your personal data will
            be permanently erased. This action cannot be undone.
          </p>
          <Button
            variant='primary'
            title='Delete your Account'
            className='mt-4 bg-primary-monkeyWhite text-primary-monkeyBlack hover:text-primary-monkeyBlack'
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
