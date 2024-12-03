'use client';

import { useEffect, useState } from 'react';

import { useTheme } from 'next-themes';

import Icon from './icon';

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (resolvedTheme === 'dark') {
    return (
      <div
        className='hover:opacity-75 cursor-pointer'
        onClick={() => setTheme('light')}
      >
        <Icon name='RiMoon' size={22} />
      </div>
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <div
        className='hover:opacity-75 cursor-pointer'
        onClick={() => setTheme('dark')}
      >
        <Icon name='RiSun' size={22} />
      </div>
    );
  }
};

export default ThemeSwitch;
