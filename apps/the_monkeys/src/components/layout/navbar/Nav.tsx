'use client';

import Link from 'next/link';

import { CreateButton } from '@/components/buttons/createButton';
import LoginButton from '@/components/buttons/loginButton';
import Logo from '@/components/logo';
import { SearchInput, SearchInputLink } from '@/components/search/SearchInput';
import ThemeSwitch from '@/components/themeSwitch';
import { HOME_ROUTE } from '@/constants/routeConstants';
import { IUser } from '@/services/models/user';

import Container from '../Container';
import ProfileDropdown from './profileDropdown';

const Nav = ({
  session,
  isAuthLoading,
}: {
  session?: IUser;
  isAuthLoading: boolean;
}) => {
  return (
    <header className='sticky top-0 left-0 border-b-[0.5px] border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark shadow-sm z-30'>
      <Container className='w-full max-w-[1500px] px-[10px] py-3 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-20 sm:gap-6'>
          <Link href={HOME_ROUTE} className='group flex items-center gap-[6px]'>
            <div className='w-9 flex justify-center items-center filter group-hover:brightness-90'>
              <Logo />
            </div>
            <p className='hidden md:block pt-1 font-dm_sans font-medium tracking-tight text-[25px] group-hover:opacity-90'>
              Monkeys
            </p>
          </Link>

          <div className='flex items-center justify-center gap-[10px] sm:gap-4'>
            <div className='block sm:hidden'>
              <SearchInputLink />
            </div>
            <SearchInput className='hidden sm:block w-[180px] md:w-[280px]' />
          </div>
        </div>

        <div className='flex items-center space-x-[6px]'>
          <ThemeSwitch />
          {session ? (
            <div className='flex items-center gap-2'>
              {isAuthLoading ? null : <CreateButton />}
              {/* <WSNotificationDropdown /> */}

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
