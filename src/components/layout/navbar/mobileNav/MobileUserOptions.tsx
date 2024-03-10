import LogoutButton from '@/components/auth/LogoutButton';
import Icon from '@/components/icon';
import Link from 'next/link';
import React, { FC, SetStateAction } from 'react';

type MobileUserOptionsProps = {
  setUserOptions: React.Dispatch<SetStateAction<boolean>>;
};

const MobileUserOptions: FC<MobileUserOptionsProps> = ({ setUserOptions }) => {
  return (
    <div
      className='absolute right-0 top-8 flex h-fit max-h-[80vh] w-40 flex-col gap-2 overflow-hidden rounded-lg border-1 border-secondary-lightGrey/25 bg-primary-monkeyWhite pb-2 dark:bg-primary-monkeyBlack'
      onMouseEnter={() => setUserOptions(true)}
      onMouseLeave={() => setUserOptions(false)}
    >
      <div className='flex flex-col gap-2 py-2'>
        <Link
          href='/profile'
          className='group flex w-full items-center justify-start gap-2 px-4 py-2 transition-all'
        >
          <Icon name='RiUserLine' size={20} />
          <p className='font-josefin_Sans group-hover:opacity-75'>Profile</p>
        </Link>

        <Link
          href='/bookmarks'
          className='group flex w-full items-center justify-start gap-2 px-4 py-2 transition-all'
        >
          <Icon name='RiBookmarkLine' size={20} />
          <p className='font-josefin_Sans group-hover:opacity-75'>Bookmarks</p>
        </Link>
      </div>

      <LogoutButton className='self-center' />
    </div>
  );
};

export default MobileUserOptions;