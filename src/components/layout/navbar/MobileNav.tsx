import { useEffect, useState } from 'react';

import Link from 'next/link';

import { CreateButton } from '@/components/buttons/createButton';
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
        className={`sticky left-0 top-${top} bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-xl z-30`}
      >
        <Container className='w-full p-4 flex items-center justify-between'>
          <Link href='/'>
            <Logo showMobileLogo={true} />
          </Link>

          <div className='flex items-center gap-4'>
            <ThemeSwitch />

            <ProfileDropdown />
          </div>
        </Container>
      </header>

      <div className='fixed bottom-0 left-0 flex w-full px-5 py-2 items-center justify-evenly border-t-1 border-foreground-light dark:border-foreground-dark bg-background-light dark:bg-background-dark z-50'>
        <CreateButton />
      </div>
    </>
  );
};

export default MobileNav;
