'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CreateButton } from '@/components/buttons/createButton';
import LoginButton from '@/components/buttons/loginButton';
import Logo from '@/components/logo';
import { SearchInput, SearchInputLink } from '@/components/search/SearchInput';
import ThemeSwitch from '@/components/themeSwitch';
import { HOME_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { cn } from '@/lib/utils';
import { IUser } from '@/services/models/user';

import Container from '../Container';
import { TopicBar } from './TopicBar';
import WSNotificationDropdown from './WSNotificationDropdown';
import ProfileDropdown from './profileDropdown';

const Nav = ({
  session,
  isAuthLoading,
}: {
  session?: IUser;
  isAuthLoading: boolean;
}) => {
  const pathname = usePathname();

  return (
    <header className='sticky top-0 left-0 border-b border-gray-100 bg-white/90 backdrop-blur-md z-40'>
      <Container className='w-full px-4 sm:px-6 py-2.5 flex flex-col gap-1'>
        <div className='flex items-center justify-between gap-4 w-full'>
          {/* Left Side: Logo */}
          <div className='flex items-center shrink-0'>
            <Link
              href={HOME_ROUTE}
              className='group flex items-center gap-2.5 shrink-0'
            >
              <div className='w-9 h-9 flex justify-center items-center bg-gray-50 rounded-lg group-hover:scale-105 transition-transform'>
                <Logo />
              </div>
              <p className='hidden md:block pt-1 font-dm_sans font-medium tracking-tight text-3xl text-stitch-on-background group-hover:text-stitch-primary transition-colors'>
                Monkeys
              </p>
            </Link>
          </div>

          {/* Middle: Desktop Topics */}
          <div className='hidden lg:flex flex-1 min-w-0 justify-center px-4'>
            <TopicBar className='w-full max-w-[720px]' pathname={pathname} />
          </div>

          {/* Right Side: Search & Actions */}
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

              <div className='h-8 w-[1px] bg-gray-100 mx-1 hidden sm:block' />

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

        {/* Mobile Topics Row */}
        <TopicBar
          className='lg:hidden w-full border-t border-gray-50 pt-1'
          pathname={pathname}
        />
      </Container>
    </header>
  );
};

export default Nav;
