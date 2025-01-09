'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { CreateButton } from '@/components/buttons/createButton';
import Logo from '@/components/logo';
import ThemeSwitch from '@/components/themeSwitch';
import { Separator } from '@/components/ui/separator';
import { FEED_ROUTE } from '@/constants/routeConstants';
import { twMerge } from 'tailwind-merge';

import Container from '../Container';
// Use as fallback if WebSocket is not working.
// import NotificationDropdown from './NotificationDropdown';
import WSNotificationDropdown from './WSNotificationDropdown';
import ProfileDropdown from './profileDropdown';

const Nav = () => {
  const [prevScrollpos, setPrevScrollpos] = useState(0);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (prevScrollpos > currentScrollPos) {
        setTop(0);
      } else {
        setTop(-50);
      }
      setPrevScrollpos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollpos]);

  return (
    <header
      className={twMerge(
        'hidden md:block sticky left-0 border-foreground-light dark:border-foreground-dark bg-background-light/80  dark:bg-background-dark/80 backdrop-blur-sm z-30',
        `top-${top}`,
        top === 0 && prevScrollpos === 0 ? 'border-none' : 'border-b-1'
      )}
    >
      <Container className='w-full px-4 py-[14px] flex items-center justify-between'>
        <Link href={FEED_ROUTE}>
          <Logo />
        </Link>

        <div className='flex items-center space-x-3'>
          <div className='flex items-center gap-3'>
            <ThemeSwitch />

            {/* Use <NotificationDropdown /> as a fallback if WebSocket is not working.
            Uncomment only when necessary. */}

            <WSNotificationDropdown />

            <ProfileDropdown />

            <Separator orientation='vertical' className='h-8' />

            <CreateButton />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Nav;
