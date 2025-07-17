'use client';

import { useEffect, useState } from 'react';

import { Button } from '@the-monkeys/ui/atoms/button';
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
      <Button
        variant='ghost'
        size='icon'
        className='rounded-full hover:opacity-80 cursor-pointer'
        onClick={() => setTheme('light')}
        title='Switch Theme'
      >
        <Icon name='RiMoon' className='animate-theme-spin direction-reverse' />
      </Button>
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <Button
        variant='ghost'
        size='icon'
        className='rounded-full hover:opacity-80 cursor-pointer'
        onClick={() => setTheme('dark')}
        title='Switch Theme'
      >
        <Icon name='RiSun' className='animate-theme-spin' />
      </Button>
    );
  }
};

export default ThemeSwitch;
