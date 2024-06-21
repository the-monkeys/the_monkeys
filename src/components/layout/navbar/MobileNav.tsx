import { useEffect, useState } from 'react';

import Link from 'next/link';

import CreateButton from '@/components/buttons/createButton';
import Icon from '@/components/icon';
import Logo from '@/components/logo';
import ThemeSwitch from '@/components/themeSwitch';

import Container from '../Container';
import ProfileDropdown from './profileDropdown';

const MobileNav = () => {
  const [prevScrollpos, setPrevScrollpos] = useState(0);
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

  return (
    <>
      <header
        className={`sticky left-0 top-${top} bg-primary-monkeyWhite/50 dark:bg-primary-monkeyBlack/50 backdrop-blur-lg z-30`}
      >
        <Container className='w-full p-5 flex items-center justify-between'>
          <Link href='/'>
            <Logo showMobileLogo={true} />
          </Link>

          <ProfileDropdown />
        </Container>
      </header>

      <div className='fixed bottom-0 left-0 flex w-full px-5 py-4 items-center justify-evenly bg-primary-monkeyWhite dark:bg-primary-monkeyBlack z-50'>
        <ThemeSwitch />

        <CreateButton />

        <Link href='/notifications' className='hover:opacity-75 cursor-pointer'>
          <Icon name='RiNotification3' size={24} />
        </Link>
      </div>
    </>
  );
};

export default MobileNav;
