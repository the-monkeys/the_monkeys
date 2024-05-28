'use client';

import React from 'react';

import Button from '@/components/button';

const ProfileVisibility = () => {
  return (
    <div className='w-full'>
      <p className='font-josefin_Sans text-lg'>Update your Email</p>

      <p className='font-light font-jost opacity-75'>
        Change your username to something that reflects your individuality.
      </p>

      <Button
        variant='secondary'
        title='Be Anonymous'
        className='mt-4 bg-primary-monkeyWhite text-primary-monkeyBlack hover:text-primary-monkeyBlack'
      />
    </div>
  );
};

export default ProfileVisibility;
