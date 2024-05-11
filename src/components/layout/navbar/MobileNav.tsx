import { useState } from 'react';

import Link from 'next/link';

import ThemeSwitch from '@/components/basic/ThemeSwitch';
import Icon from '@/components/icon';
import Logo from '@/components/logo';

import CreateButton from '../../button/CreateButton';
import UserOptions from './UserOptions';

const MobileNav = () => {
  const [showUserOptions, setShowUserOptions] = useState<boolean>(false);

  const handleShowUserOptions = () => {
    setShowUserOptions((prevVal) => !prevVal);
  };

  return (
    <>
      <div className='sticky left-0 top-0 flex w-full items-center justify-between gap-5 bg-primary-monkeyWhite/75 px-5 py-2 backdrop-blur-sm dark:bg-primary-monkeyBlack/75 z-30'>
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
            <UserOptions setUserOptions={setShowUserOptions} />
          )}
        </div>
      </div>

      <div className='fixed bottom-0 left-0 flex w-full items-center justify-evenly bg-primary-monkeyWhite px-5 py-4 dark:bg-primary-monkeyBlack z-50 border-t-1 border-secondary-lightGrey/25'>
        <ThemeSwitch />

        <CreateButton showTitle={false} />

        <Link href='/notifications' className='relative'>
          <Icon name='RiNotification3Line' />
        </Link>
      </div>
    </>
  );
};

export default MobileNav;
