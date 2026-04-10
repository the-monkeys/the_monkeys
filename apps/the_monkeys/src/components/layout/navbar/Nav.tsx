'use client';

import { CreateButton } from '@/components/buttons/createButton';
import LoginButton from '@/components/buttons/loginButton';
import { SearchInput, SearchInputLink } from '@/components/search/SearchInput';
import { IUser } from '@/services/models/user';

import Container from '../Container';
import WSNotificationDropdown from './WSNotificationDropdown';
import ProfileDropdown from './profileDropdown';
import ThemeSwitch from '@/components/themeSwitch';

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
        <div className='flex items-center justify-center gap-[10px] sm:gap-4'>
          <div className='block sm:hidden'>
            <SearchInputLink />
          </div>
          <SearchInput className='hidden sm:block w-[250px] md:w-[320px]' />
        </div>

        <div className='flex items-center space-x-[6px]'>
          {session ? (
            <div className='flex items-center gap-2'>
              {isAuthLoading ? null : <CreateButton />}
              {/* <WSNotificationDropdown /> */}
                        <ThemeSwitch />
              
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
