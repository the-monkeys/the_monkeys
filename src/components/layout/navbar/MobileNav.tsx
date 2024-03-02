import ThemeSwitch from '@/components/basic/ThemeSwitch';
import Icon from '@/components/icon';
import Logo from '@/components/logo';
import CreateButton from './CreateButton';

const MobileNav = () => {
  return (
    <>
      <div className='sticky left-0 top-0 flex w-full items-center justify-between gap-5 bg-primary-monkeyWhite/75 px-5 py-2 backdrop-blur-md dark:bg-primary-monkeyBlack/75'>
        <Logo showMobileLogo={true} />

        <CreateButton />
      </div>

      <div className='fixed bottom-0 left-0 flex w-full items-center justify-evenly border-t-1 border-secondary-lightGrey/25 bg-primary-monkeyWhite/50 px-5 py-4 backdrop-blur-sm dark:bg-primary-monkeyBlack/50'>
        <Icon name='RiBookmarkLine' />
        <ThemeSwitch />
        <Icon name='RiNotification3Line' />
        <Icon name='RiUser3Line' />
      </div>
    </>
  );
};

export default MobileNav;
