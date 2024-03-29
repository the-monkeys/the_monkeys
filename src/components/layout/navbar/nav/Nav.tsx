import { useState } from 'react';

import Link from 'next/link';

import ThemeSwitch from '@/components/basic/ThemeSwitch';
import IconContainer from '@/components/icon';
import Logo from '@/components/logo';
import SearchBox from '@/components/searchBox';

import CreateButton from '../CreateButton';
import UserOptions from './UserOptions';
import NotificationsDialog from './notifications/NotificationsDialog';

const Nav = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showUserOptions, setShowUserOptions] = useState<boolean>(false);

  const handleShowNotifications = () => {
    setShowUserOptions(false);
    setShowNotifications((prevVal) => !prevVal);
  };

  const handleShowUserOptions = () => {
    setShowNotifications(false);
    setShowUserOptions((prevVal) => !prevVal);
  };

  return (
    <div className='sticky left-0 top-0 flex w-full items-center justify-between bg-primary-monkeyWhite/75 px-5 py-2 backdrop-blur-md dark:bg-primary-monkeyBlack/75'>
      <div className='flex items-center gap-5'>
        <Link href='/'>
          <Logo showMobileLogo={true} />
        </Link>
        <SearchBox setSearchInput={setSearchInput} className='w-32 md:w-64' />
      </div>

      <div className='flex items-center gap-5'>
        <div className='flex items-center gap-5'>
          <ThemeSwitch />

          <div className='relative'>
            {showNotifications ? (
              <div className='relative'>
                <span className='absolute right-0 top-0 z-10 h-2 w-2 rounded-full bg-primary-monkeyOrange'></span>
                <IconContainer
                  name='RiNotification3Fill'
                  onClick={handleShowNotifications}
                />
              </div>
            ) : (
              <div className='relative'>
                <span className='absolute right-0 top-0 z-10 h-2 w-2 rounded-full bg-primary-monkeyOrange'></span>
                <IconContainer
                  name='RiNotification3Line'
                  onClick={handleShowNotifications}
                />
              </div>
            )}
            {showNotifications && (
              <NotificationsDialog setNotifications={setShowNotifications} />
            )}
          </div>

          <div className='relative'>
            {showUserOptions ? (
              <IconContainer
                name='RiUserFill'
                onClick={handleShowUserOptions}
              />
            ) : (
              <IconContainer
                name='RiUserLine'
                onClick={handleShowUserOptions}
              />
            )}
            {showUserOptions && (
              <UserOptions setUserOptions={setShowUserOptions} />
            )}
          </div>
        </div>
        <div className='h-8 border-l-1 border-secondary-lightGrey/25'></div>
        <CreateButton showTitle />
      </div>
    </div>
  );
};

export default Nav;
