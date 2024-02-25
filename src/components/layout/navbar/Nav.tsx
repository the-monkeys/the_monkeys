import { useState } from 'react';

import ThemeSwitch from '@/components/basic/ThemeSwitch';
import Icon from '@/components/icon';
import Logo from '@/components/logo';
import SearchBox from '@/components/searchBox';
import CreateButton from './CreateButton';

const Nav = () => {
  const [searchInput, setSearchInput] = useState<string>('');

  return (
    <div className='sticky left-0 top-0 flex w-full items-center justify-between bg-primary-monkeyWhite/75 px-5 py-2 backdrop-blur-md dark:bg-primary-monkeyBlack/75'>
      <div className='flex items-center gap-5'>
        <Logo showMobileLogo={true} />
        <SearchBox setSearchInput={setSearchInput} className='w-32 md:w-64' />
      </div>

      <div className='flex items-center gap-5'>
        <div className='flex items-center gap-5'>
          <ThemeSwitch />
          <Icon name='RiNotification3Line' />
          <Icon name='RiUser3Line' />
        </div>
        <div className='h-8 border-l-1 border-secondary-lightGrey/25'></div>
        <CreateButton />
      </div>
    </div>
  );
};

export default Nav;
