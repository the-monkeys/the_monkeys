'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const ProfileVisibility = () => {
  return (
    <div className='flex flex-col items-start'>
      <h4 className='font-josefin_Sans text-lg'>Change Profile Visibility</h4>

      <p className='font-jost text-sm opacity-75'>
        If your make yourself anonymous, your profile information will remain
        hidden from others during any activity.
      </p>

      <div className='mt-4 flex items-center space-x-2'>
        <Label htmlFor='anonymous'>Make yourself Anonymous</Label>
        <Switch id='anonymous' />
      </div>
    </div>
  );
};

export default ProfileVisibility;
