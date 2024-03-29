import { useState } from 'react';

import Link from 'next/link';

import ThemeSwitch from '@/components/basic/ThemeSwitch';
import Icon from '@/components/icon';
import Logo from '@/components/logo';

import CreateButton from '../CreateButton';
import MobileUserOptions from './MobileUserOptions';

const MobileNav = () => {
  const [showUserOptions, setShowUserOptions] = useState<boolean>(false);

  const handleShowUserOptions = () => {
    setShowUserOptions((prevVal) => !prevVal);
  };

  return (
    <>
      <div className='sticky left-0 top-0 flex w-full items-center justify-between gap-5 bg-primary-monkeyWhite/75 px-5 py-2 backdrop-blur-md dark:bg-primary-monkeyBlack/75'>
        <Link href='/'>
          <Logo showMobileLogo={true} />
        </Link>

        <div className='relative'>
          {showUserOptions ? (
            <Icon name='RiUserFill' onClick={handleShowUserOptions} />
          ) : (
            <Icon name='RiUserLine' onClick={handleShowUserOptions} />
          )}
          {showUserOptions && (
            <MobileUserOptions setUserOptions={setShowUserOptions} />
          )}
        </div>
      </div>

      <div className='fixed bottom-0 left-0 flex w-full items-center justify-evenly bg-primary-monkeyWhite/50 px-5 py-4 backdrop-blur-sm dark:bg-primary-monkeyBlack/50 z-50'>
        <ThemeSwitch />

        <CreateButton showTitle={false} />

        <Link href='/notifications' className='relative'>
          <span className='absolute right-0 top-0 z-10 h-2 w-2 rounded-full bg-primary-monkeyOrange'></span>
          <Icon name='RiNotification3Line' />
        </Link>
      </div>
    </>
  );
};

export default MobileNav;
