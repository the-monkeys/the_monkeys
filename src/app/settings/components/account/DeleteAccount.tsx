'use client';

import React from 'react';

import { Button } from '@/components/ui/button';

const DeleteAccount = () => {
  return (
    <div className='flex flex-col items-start'>
      <h4 className='font-josefin_Sans text-lg'>Delete Account</h4>

      <p className='font-jost text-sm opacity-75'>
        When you delete your account on Monkeys, all your personal data will be
        permanently erased. This action cannot be undone.
      </p>

      <Button variant='destructive' className='mt-4'>
        Delete Account
      </Button>
    </div>
  );
};

export default DeleteAccount;
