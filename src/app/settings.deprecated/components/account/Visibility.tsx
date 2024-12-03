'use client';

import React from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Visibility = () => {
  return (
    <div className='flex flex-col items-start'>
      <h4 className='font-dm_sans text-lg'>Change Profile Visibility</h4>

      <p className='font-roboto text-sm opacity-75'>
        If your make yourself anonymous, your profile information will remain
        hidden from others during any activity.
      </p>

      <div className='mt-4 flex items-center space-x-2'>
        <Switch id='anonymous' disabled />
        <Label htmlFor='anonymous'>Make yourself Anonymous</Label>
      </div>
    </div>
  );
};

export default Visibility;
