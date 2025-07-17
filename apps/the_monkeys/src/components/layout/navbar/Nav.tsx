'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { CreateButton } from '@/components/buttons/createButton';
import LoginButton from '@/components/buttons/loginButton';
import Logo from '@/components/logo';
import ThemeSwitch from '@/components/themeSwitch';
import { FEED_ROUTE } from '@/constants/routeConstants';
import { IUser } from '@/services/models/user';
import { twMerge } from 'tailwind-merge';

import Container from '../Container';
// Use as fallback if WebSocket is not working.
// import NotificationDropdown from './NotificationDropdown';
import WSNotificationDropdown from './WSNotificationDropdown';
import ProfileDropdown from './profileDropdown';

const Nav = ({
  session,
  isAuthLoading,
}: {
  session?: IUser;
  isAuthLoading: boolean;
}) => {
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
        'sticky left-0 border-b-1 border-border-light/60 dark:border-border-dark/60 bg-background-light dark:bg-background-dark z-30',
        `top-${top}`
      )}
    >
      <Container className='w-full px-4 py-[10px] flex items-center justify-between'>
        <div className='flex items-center gap-[6px]'>
          <Link href={FEED_ROUTE} className='group flex items-center gap-[6px]'>
            <div className='w-9 flex justify-center items-center group-hover:opacity-85'>
              <Logo />
            </div>

            <div className='hidden md:block pt-1'>
              <p className='font-dm_sans font-medium text-2xl'>Monkeys</p>
            </div>
          </Link>
        </div>

        <div className='flex items-center space-x-[10px]'>
          <div className='flex items-center gap-2'>
            <ThemeSwitch />
            {/* Use <NotificationDropdown /> as a fallback if WebSocket not working*/}
            {!isAuthLoading && session && <WSNotificationDropdown />}
          </div>

          {session ? (
            <div className='flex items-center gap-[10px]'>
              <CreateButton />
              <ProfileDropdown session={session} />
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <LoginButton />
            </div>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Nav;
