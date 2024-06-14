import Link from 'next/link';

import CreateButton from '@/components/buttons/createButton';
import Logo from '@/components/logo';
import ThemeSwitch from '@/components/themeSwitch';
import { Separator } from '@/components/ui/separator';

import Container from '../Container';
import NotificationDropdown from './notificationDropdown';
import ProfileDropdown from './profileDropdown';

const Nav = () => {
  // Code to make the header scrollable
  // const [prevScrollpos, setPrevScrollpos] = useState(window.scrollY);
  // const [top, setTop] = useState(0);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentScrollPos = window.scrollY;
  //     if (prevScrollpos > currentScrollPos) {
  //       setTop(0);
  //     } else {
  //       setTop(-50);
  //     }
  //     setPrevScrollpos(currentScrollPos);
  //   };

  //   window.addEventListener('scroll', handleScroll);

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [prevScrollpos]);

  return (
    <header
      className={`sticky left-0 top-0 bg-primary-monkeyWhite/50 dark:bg-primary-monkeyBlack/50 backdrop-blur-lg z-30`}
    >
      <Container className='w-full p-5 flex items-center justify-between'>
        <div className='flex items-center gap-5'>
          <Link href='/'>
            <Logo showMobileLogo={true} />
          </Link>
        </div>

        <div className='flex items-center space-x-4'>
          <div className='flex items-center gap-5'>
            <ThemeSwitch />

            <NotificationDropdown />

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
