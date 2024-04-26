import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import ThemeSwitch from '@/components/basic/ThemeSwitch';
import IconContainer from '@/components/icon';
import Logo from '@/components/logo';
import SearchBox from '@/components/searchBox';

import CreateButton from '../../button/CreateButton';
import UserOptions from './UserOptions';
import NotificationsDialog from './notifications/NotificationsDialog';

const Nav = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showUserOptions, setShowUserOptions] = useState<boolean>(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userOptionsRef = useRef<HTMLDivElement>(null);

  const handleNotificationClick = () => {
    if (showUserOptions) {
      setShowUserOptions(false);
    }

    setShowNotifications(true);
  };

  const handleUserOptionsClick = () => {
    if (showNotifications) {
      setShowNotifications(false);
    }

    setShowUserOptions(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target as Node)
    ) {
      setShowNotifications(false);
    }

    if (
      userOptionsRef.current &&
      !userOptionsRef.current.contains(event.target as Node)
    ) {
      setShowUserOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='sticky left-0 top-0 flex w-full items-center justify-between bg-primary-monkeyWhite/75 px-5 py-2 backdrop-blur-md dark:bg-primary-monkeyBlack/75 z-30'>
      <div className='flex items-center gap-5'>
        <Link href='/'>
          <Logo showMobileLogo={true} />
        </Link>

        <SearchBox
          setSearchInput={setSearchInput}
          className='w-32 md:w-64 text-sm sm:text-base'
        />
      </div>

      <div className='flex items-center gap-5'>
        <div className='flex items-center gap-5'>
          <ThemeSwitch />

          <div
            className='relative'
            onClick={handleNotificationClick}
            ref={notificationsRef}
          >
            <div className='relative'>
              <IconContainer
                name={
                  showNotifications
                    ? 'RiNotification3Fill'
                    : 'RiNotification3Line'
                }
                hasHover={false}
              />
            </div>

            {showNotifications && (
              <NotificationsDialog setNotifications={setShowNotifications} />
            )}
          </div>

          <div
            className='relative'
            onClick={handleUserOptionsClick}
            ref={userOptionsRef}
          >
            <IconContainer
              name={showUserOptions ? 'RiUserFill' : 'RiUserLine'}
              hasHover={false}
            />

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
