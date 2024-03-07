import ThemeSwitch from '@/components/basic/ThemeSwitch';
import Icon from '@/components/icon';
import Logo from '@/components/logo';
import CreateButton from '../CreateButton';
import Link from 'next/link';

const MobileNav = () => {
  return (
    <>
      <div className='sticky left-0 top-0 flex w-full items-center justify-between gap-5 bg-primary-monkeyWhite/75 px-5 py-2 backdrop-blur-md dark:bg-primary-monkeyBlack/75'>
        <Logo showMobileLogo={true} />

        <CreateButton />
      </div>

      <div className='fixed bottom-0 left-0 flex w-full items-center justify-evenly border-t-1 border-secondary-lightGrey/25 bg-primary-monkeyWhite/50 px-5 py-4 backdrop-blur-sm dark:bg-primary-monkeyBlack/50'>
        <Link href='/bookmarks'>
          <Icon name='RiBookmarkLine' />
        </Link>
        <ThemeSwitch />
        <Link href='/notifications' className='relative'>
          <span className='absolute right-0 top-0 z-10 h-2 w-2 rounded-full bg-primary-monkeyOrange'></span>
          <Icon name='RiNotification3Line' />
        </Link>
        <Icon name='RiUser3Line' />
      </div>
    </>
  );
};

export default MobileNav;