'use client';

import React from 'react';

import Button from '@/components/button';

const ProfileVisibility = () => {
  return (
    <div>
      <div className='grid grid-cols-[25%_70%]'>
        <div className='font-josefin_Sans text-xl '>Profile visibility</div>
        <div>
          <p className='font-josefin_Sans text-base text-primary-monkeyWhite '>
            Update Your Username
          </p>
          <p className='font-jost text-secondary-mute'>
            Change your username to something that reflects your individuality.
          </p>
          <Button
            variant='secondary'
            title='Be Anonymous'
            className='mt-4 bg-primary-monkeyWhite text-primary-monkeyBlack hover:text-primary-monkeyBlack'
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileVisibility;
