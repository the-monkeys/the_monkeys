import { useEffect, useState } from 'react';

import Link from 'next/link';

import ThemeSwitch from '@/components/basic/ThemeSwitch';
import CreateButton from '@/components/buttons/createButton';
import Icon from '@/components/icon/icon';
import Logo from '@/components/logo';

import UserOptions from './UserOptions';

const MobileNav = () => {
  const [showUserOptions, setShowUserOptions] = useState<boolean>(false);

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

  const handleShowUserOptions = () => {
    setShowUserOptions((prevVal) => !prevVal);
  };

  return (
    <>
      <header
        className={`sticky left-0 top-${top} flex w-full px-5 py-4 items-center justify-between bg-primary-monkeyWhite/50 dark:bg-primary-monkeyBlack/50 backdrop-blur-lg z-30`}
      >
        <Link href='/'>
          <Logo showMobileLogo={true} />
        </Link>

        <div className='relative'>
          {showUserOptions ? (
            <div onClick={handleShowUserOptions}>
              <Icon name='RiUser' type='Fill' size={24} />
            </div>
          ) : (
            <div onClick={handleShowUserOptions}>
              <Icon name='RiUser' size={24} />
            </div>
          )}
          {showUserOptions && (
            <UserOptions setUserOptions={setShowUserOptions} />
          )}
        </div>
      </header>

      <div className='fixed bottom-0 left-0 flex w-full px-5 py-2 items-center justify-evenly bg-primary-monkeyWhite dark:bg-primary-monkeyBlack z-50'>
        <ThemeSwitch />

        <CreateButton />

        <Link href='/notifications' className='relative'>
          <Icon name='RiNotification3' />
        </Link>
      </div>
    </>
  );
};

export default MobileNav;
