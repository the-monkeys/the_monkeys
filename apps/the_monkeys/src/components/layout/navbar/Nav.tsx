'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CreateButton } from '@/components/buttons/createButton';
import LoginButton from '@/components/buttons/loginButton';
import Icon from '@/components/icon';
import Logo from '@/components/logo';
import { SearchInput, SearchInputLink } from '@/components/search/SearchInput';
import ThemeSwitch from '@/components/themeSwitch';
import { HOME_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { cn } from '@/lib/utils';

import Container from '../Container';
import { MobileNavDrawer } from './MobileNavDrawer';
import { TopicBar } from './TopicBar';
import WSNotificationDropdown from './WSNotificationDropdown';
import ProfileDropdown from './profileDropdown';

const STYLES = {
  iconButton:
    'p-2 hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40 rounded-md transition-colors',
  divider: 'h-8 w-[1px] bg-gray-100 dark:bg-gray-800 mx-1 hidden sm:block',
} as const;

const Nav = () => {
  const pathname = usePathname();
  const { data: session, isLoading: isAuthLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className='sticky top-0 left-0  bg-white dark:bg-background-dark backdrop-blur-md z-40'>
        <Container className='w-full  pt-2.5 flex flex-col gap-1'>
          <div className='flex items-center justify-between gap-4 w-full'>
            {/* Left: Hamburger & Logo */}
            <div className='flex items-center shrink-0 gap-3'>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={cn(STYLES.iconButton, 'lg:hidden')}
                aria-label='Open menu'
              >
                <Icon name='RiMenu' size={24} />
              </button>

              <Link
                href={HOME_ROUTE}
                className='group flex items-center gap-2.5 shrink-0'
              >
                <div className='w-9 h-9 flex justify-center items-center rounded-lg group-hover:scale-105 transition-transform'>
                  <Logo />
                </div>
                <p className='hidden md:block pt-1 font-dm_sans font-medium tracking-tight text-3xl text-text-light dark:text-text-dark group-hover:text-brand-orange transition-colors'>
                  Monkeys
                </p>
              </Link>
            </div>

            {/* Middle: Desktop Topics */}
            <div className='hidden lg:flex flex-1 min-w-0 justify-center px-4'>
              <TopicBar className='w-full max-w-[720px]' pathname={pathname} />
            </div>

            {/* Right: Search & Actions */}
            <div className='flex items-center justify-end gap-4 shrink-0'>
              <div className='max-w-[240px]'>
                <SearchInput className='hidden sm:block' />
              </div>

              <div className='flex items-center gap-3'>
                <div className='block sm:hidden'>
                  <SearchInputLink />
                </div>

                <ThemeSwitch />
                {session && <WSNotificationDropdown />}

                <div className={STYLES.divider} />

                {session ? (
                  <div className='flex items-center gap-3'>
                    {!isAuthLoading && <CreateButton />}
                    <ProfileDropdown session={session} />
                  </div>
                ) : (
                  <LoginButton />
                )}
              </div>
            </div>
          </div>
          <div className='border-b border-gray-100 dark:border-border-dark' />

          {/* Mobile Topics Row */}
          <TopicBar className='lg:hidden w-full pt-1' pathname={pathname} />
        </Container>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        session={session}
      />
    </>
  );
};

export default Nav;
