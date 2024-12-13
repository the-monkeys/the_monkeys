'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { CreateButton } from '@/components/buttons/createButton';
import Logo from '@/components/logo';
import ThemeSwitch from '@/components/themeSwitch';

import Container from '../Container';
// Use as fallback if WebSocket is not working.
// import NotificationDropdown from './NotificationDropdown';
import WSNotificationDropdown from './WSNotificationDropdown';
import ProfileDropdown from './profileDropdown';

const MobileNav = () => {
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
    <>
      <header
        className={`block md:hidden sticky left-0 top-${top} bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-xl z-30`}
      >
        <Container className='w-full p-4 flex items-center justify-between'>
          <Link href='/feed'>
            <Logo />
          </Link>

          <div className='flex items-center gap-3'>
            <ThemeSwitch />

            {/* Use <NotificationDropdown /> as a fallback if WebSocket is not working.
            Uncomment only when necessary. */}

            <WSNotificationDropdown />

            <ProfileDropdown />
          </div>
        </Container>
      </header>

      <div className='md:hidden fixed bottom-0 left-0 flex w-full px-5 py-2 items-center justify-evenly border-t-1 border-foreground-light dark:border-foreground-dark bg-background-light dark:bg-background-dark z-50'>
        <CreateButton />
      </div>
    </>
  );
};

export default MobileNav;
