'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { CreateButton } from '@/components/buttons/createButton';
import LoginButton from '@/components/buttons/loginButton';
import Logo from '@/components/logo';
import { SearchInput, SearchInputLink } from '@/components/search/SearchInput';
import ThemeSwitch from '@/components/themeSwitch';
import { HOME_ROUTE } from '@/constants/routeConstants';
import { IUser } from '@/services/models/user';
import { twMerge } from 'tailwind-merge';

import Container from '../Container';
import NotificationDropdown from './NotificationDropdown';
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

  // Handle scroll hide/show behavior
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollpos]);

  return (
    <header
      className={twMerge(
        'sticky top-0 left-0 border-b-1 border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark shadow-sm z-30',
        `top-${top}`,
        prevScrollpos === 0 && 'shadow-none'
      )}
    >
      <Container className='w-full max-w-[1500px] px-[10px] py-3 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-[10px] sm:gap-4'>
          <Link href={HOME_ROUTE} className='group flex items-center gap-[6px]'>
            <div className='w-9 flex justify-center items-center filter group-hover:brightness-90'>
              <Logo />
            </div>

            <div className='hidden md:block pt-1'>
              <p className='font-dm_sans font-medium tracking-tight text-[25px] group-hover:opacity-90'>
                Monkeys
              </p>
            </div>
          </Link>

          <div className='block sm:hidden'>
            <SearchInputLink />
          </div>

          <SearchInput className='hidden sm:block w-[250px] md:w-[320px]' />
        </div>

        <div className='flex items-center space-x-[6px]'>
          <div className='flex items-center gap-[2px]'>
            {!isAuthLoading && session && (
              <NotificationDropdown session={session} />
            )}
            <ThemeSwitch />
          </div>

          {session ? (
            <div className='flex items-center gap-2'>
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
