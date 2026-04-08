'use client';

import { useEffect, useState } from 'react';

import Icon from '@/components/icon';
import { useTheme } from 'next-themes';

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className='flex w-full items-center gap-2 opacity-50 pointer-events-none'>
        <div className='size-[18px] rounded-full bg-foreground-light dark:bg-foreground-dark animate-pulse' />
        <p className='font-dm_sans text-sm sm:text-base'>Theme</p>
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type='button'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className='flex w-full items-center gap-2'
    >
      <Icon name={isDark ? 'RiSun' : 'RiMoon'} size={18} />
      <p className='font-dm_sans text-sm sm:text-base'>
        {isDark ? 'Light mode' : 'Dark mode'}
      </p>
    </button>
  );
};

export default ThemeSwitch;
