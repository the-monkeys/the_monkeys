'use client';

import { useEffect, useState } from 'react';

import { useTheme } from 'next-themes';

import Icon from './icon';

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div className='size-4 rounded-full bg-foreground-light dark:bg-foreground-dark'></div>
    );

  if (resolvedTheme === 'dark') {
    return (
      <div
        className='hover:opacity-75 cursor-pointer'
        onClick={() => setTheme('light')}
      >
        <Icon name='RiMoon' size={22} className='animate-scale-up' />
      </div>
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <div
        className='hover:opacity-75 cursor-pointer'
        onClick={() => setTheme('dark')}
      >
        <Icon name='RiSun' size={22} className='animate-scale-up' />
      </div>
    );
  }
};

export default ThemeSwitch;
