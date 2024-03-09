import { useState } from 'react';

import ThemeSwitch from '@/components/basic/ThemeSwitch';
import Icon from '@/components/icon';
import Logo from '@/components/logo';
import SearchBox from '@/components/searchBox';
import CreateButton from '../CreateButton';
import NotificationsDialog from './notifications/NotificationsDialog';
import UserOptions from './UserOptions';

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
        <Logo showMobileLogo={true} />
        <SearchBox setSearchInput={setSearchInput} className='w-32 md:w-64' />
      </div>

      <div className='flex items-center gap-5'>
        <div className='flex items-center gap-5'>
          <ThemeSwitch />

          <div className='relative'>
            {showNotifications ? (
              <div className='relative'>
                <span className='absolute right-0 top-0 z-10 h-2 w-2 rounded-full bg-primary-monkeyOrange'></span>
                <Icon
                  name='RiNotification3Fill'
                  onClick={handleShowNotifications}
                />
              </div>
            ) : (
              <div className='relative'>
                <span className='absolute right-0 top-0 z-10 h-2 w-2 rounded-full bg-primary-monkeyOrange'></span>
                <Icon
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
              <Icon name='RiUser3Fill' onClick={handleShowUserOptions} />
            ) : (
              <Icon name='RiUser3Line' onClick={handleShowUserOptions} />
            )}
            {showUserOptions && (
              <UserOptions setUserOptions={setShowUserOptions} />
            )}
          </div>
        </div>
        <div className='h-8 border-l-1 border-secondary-lightGrey/25'></div>
        <CreateButton />
      </div>
    </div>
  );
};

export default Nav;
