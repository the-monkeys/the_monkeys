import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import CreateButton from '@/components/buttons/createButton';
import Icon from '@/components/icon/icon';
import Logo from '@/components/logo';
import ThemeSwitch from '@/components/themeSwitch';
import { Separator } from '@/components/ui/separator';

import UserOptions from './UserOptions';
import NotificationsDialog from './notifications/NotificationsDialog';

const Nav = () => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showUserOptions, setShowUserOptions] = useState<boolean>(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userOptionsRef = useRef<HTMLDivElement>(null);

  const [prevScrollpos, setPrevScrollpos] = useState(window.scrollY);
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

  const handleNotificationClick = () => {
    setShowUserOptions(false);

    setShowNotifications((prevVal) => !prevVal);
  };

  const handleUserOptionsClick = () => {
    setShowNotifications(false);

    setShowUserOptions((prevVal) => !prevVal);
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
    <header
      className={`sticky left-0 top-${top} flex w-full p-5 items-center justify-between bg-primary-monkeyWhite/50 dark:bg-primary-monkeyBlack/50 backdrop-blur-lg  z-30`}
    >
      <div className='flex items-center gap-5'>
        <Link href='/'>
          <Logo showMobileLogo={true} />
        </Link>
      </div>

      <div className='flex items-center space-x-4'>
        <div className='flex items-center gap-5'>
          <ThemeSwitch />

          <div
            className='relative'
            onClick={handleNotificationClick}
            ref={notificationsRef}
          >
            <div className='hover:text-primary-monkeyOrange cursor-pointer'>
              <Icon name='RiNotification3' size={24} />
            </div>

            {showNotifications && <NotificationsDialog />}
          </div>

          <div
            className='relative'
            onClick={handleUserOptionsClick}
            ref={userOptionsRef}
          >
            <div className='hover:text-primary-monkeyOrange cursor-pointer'>
              <Icon name='RiUser' size={24} />
            </div>

            {showUserOptions && (
              <UserOptions setUserOptions={setShowUserOptions} />
            )}
          </div>
        </div>

        <Separator orientation='vertical' className='h-8' />

        <CreateButton />
      </div>
    </header>
  );
};

export default Nav;
