'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { CreateButton } from '@/components/buttons/createButton';
import Logo from '@/components/logo';
import ThemeSwitch from '@/components/themeSwitch';
import { Separator } from '@/components/ui/separator';

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
      className={`hidden md:block sticky left-0 top-${top} bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-xl z-30`}
    >
      <Container className='w-full p-4 flex items-center justify-between'>
        <Link href='/feed'>
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
