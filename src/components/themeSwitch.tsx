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
      <button
        className='hover:opacity-80 cursor-pointer'
        onClick={() => setTheme('light')}
        title='Switch Theme'
      >
        <Icon
          name='RiMoon'
          size={22}
          className='animate-theme-spin direction-reverse'
        />
      </button>
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <button
        className='hover:opacity-80 cursor-pointer'
        onClick={() => setTheme('dark')}
        title='Switch Theme'
      >
        <Icon name='RiSun' size={22} className='animate-theme-spin' />
      </button>
    );
  }
};

export default ThemeSwitch;
