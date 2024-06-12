'use client';

import * as React from 'react';

import { useTheme } from 'next-themes';

import Icon from './icon/icon';

const ThemeSwitch = () => {
  const { setTheme, resolvedTheme } = useTheme();

  if (resolvedTheme === 'dark') {
    return (
      <div
        className='hover:text-primary-monkeyOrange cursor-pointer'
        onClick={() => setTheme('light')}
      >
        <Icon name='RiMoon' size={24} />
      </div>
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <div
        className='hover:text-primary-monkeyOrange cursor-pointer'
        onClick={() => setTheme('dark')}
      >
        <Icon name='RiSun' size={24} />
      </div>
    );
  }
};

export default ThemeSwitch;