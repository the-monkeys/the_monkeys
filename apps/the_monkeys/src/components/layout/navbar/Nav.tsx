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
    <header className='sticky top-0 left-0 border-b-1 border-stitch-outline/20 bg-stitch-background/80 backdrop-blur-md shadow-sm z-30'>
      <Container className='w-full  px-4 py-4 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-20 sm:gap-6'>
          <Link href={HOME_ROUTE} className='group flex items-center gap-2'>
            <div className='w-10 flex justify-center items-center filter group-hover:scale-105 transition-transform'>
              <Logo />
            </div>
            <p className='hidden md:block pt-1 font-newsreader font-bold tracking-tight text-3xl text-stitch-on-background group-hover:text-stitch-primary transition-colors'>
              Monkeys
            </p>
          </Link>

          <div>
            <SearchInput className='hidden sm:block w-[180px] md:w-[280px]' />
          </div>
        </div>

        <div className='flex items-center space-x-[6px]'>
          <div className='block sm:hidden'>
            <SearchInputLink />
          </div>
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
