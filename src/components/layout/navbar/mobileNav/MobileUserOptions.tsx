import React, { FC, SetStateAction } from 'react';

import Link from 'next/link';

import IconContainer from '@/components/icon';
import Icon from '@/components/icon';

type MobileUserOptionsProps = {
  setUserOptions: React.Dispatch<SetStateAction<boolean>>;
};

const MobileUserOptions: FC<MobileUserOptionsProps> = ({ setUserOptions }) => {
  return (
    <div
      className='absolute right-0 top-8 flex h-fit max-h-[80vh] w-40 flex-col gap-2 overflow-hidden rounded-lg border-1 border-secondary-lightGrey/25 bg-primary-monkeyWhite py-2 dark:bg-primary-monkeyBlack'
      onMouseEnter={() => setUserOptions(true)}
      onMouseLeave={() => setUserOptions(false)}
    >
      <Link
        href='/profile'
        className='group flex w-full items-center justify-start gap-2 px-4 py-2'
      >
        <Icon name='RiUserLine' size={20} />
        <p className='font-josefin_Sans group-hover:ml-2 transition-all'>
          Profile
        </p>
      </Link>

      <Link
        href='/bookmarks'
        className='group flex w-full items-center justify-start gap-2 px-4 py-2'
      >
        <Icon name='RiBookmarkLine' size={20} />
        <p className='font-josefin_Sans group-hover:ml-2 transition-all'>
          Bookmarks
        </p>
      </Link>

      <div className='group flex w-full items-center justify-start gap-2 px-4 py-2 text-alert-red'>
        <Icon name='RiLogoutBoxRLine' size={20} className='text-alert-red' />
        <p className='font-josefin_Sans group-hover:ml-2 transition-all'>
          Logout
        </p>
      </div>
    </div>
  );
};

export default MobileUserOptions;
