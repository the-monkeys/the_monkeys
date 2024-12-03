'use client';

import React from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const Visibility = () => {
  return (
    <div className='p-1 space-y-2'>
      <p className='font-roboto text-sm opacity-75'>
        Stay anonymous—your profile remains hidden during activities.
      </p>

      <div className='mt-4 flex items-center space-x-2'>
        <Switch id='anonymous' disabled />
        <Label htmlFor='anonymous'>Make yourself Anonymous</Label>
      </div>
    </div>
  );
};
