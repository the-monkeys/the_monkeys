'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { CreateButton } from '@/components/buttons/createButton';
import Logo from '@/components/logo';
import ThemeSwitch from '@/components/themeSwitch';
import { Separator } from '@/components/ui/separator';

import Container from '../Container';
import ProfileDropdown from './profileDropdown';

const Nav = () => {
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
    <header
      className={`sticky left-0 top-${top} bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-xl z-30`}
    >
      <Container className='w-full p-4 flex items-center justify-between'>
        <Link href='/'>
          <Logo showMobileLogo={true} />
        </Link>

        <div className='flex items-center space-x-3'>
          <div className='flex items-center gap-4'>
            <ThemeSwitch />

            {/* <Link
              href='/notifications'
              className='hover:opacity-75 cursor-pointer'
            >
              <Icon name='RiNotification3' size={24} />
            </Link> */}

            <ProfileDropdown />
          </div>

          <Separator orientation='vertical' className='h-8' />

          <CreateButton />
        </div>
      </Container>
    </header>
  );
};

export default Nav;
