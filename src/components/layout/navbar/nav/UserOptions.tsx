import React, { FC, SetStateAction } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon/Icon';
import { signOut } from 'next-auth/react';

type UserOptionsProps = {
  setUserOptions: React.Dispatch<SetStateAction<boolean>>;
};

const UserOptions: FC<UserOptionsProps> = ({ setUserOptions }) => {
  return (
    <div
      className='absolute right-0 top-8 flex h-fit max-h-[80vh] w-44 flex-col gap-2 overflow-hidden rounded-lg border-1 border-secondary-lightGrey/25 bg-primary-monkeyWhite py-2 dark:bg-primary-monkeyBlack'
      onMouseEnter={() => setUserOptions(true)}
      onMouseLeave={() => setUserOptions(false)}
    >
      <Link
        href='/profile'
        className='group flex w-full items-center justify-start gap-2 px-4 py-2'
      >
        <Icon name='RiUserLine' size={20} hasHover={false} />
        <p className='font-josefin_Sans group-hover:ml-2 transition-all'>
          Profile
        </p>
      </Link>

      <Link
        href='/bookmarks'
        className='group flex w-full items-center justify-start gap-2 px-4 py-2'
      >
        <Icon name='RiBookmarkLine' size={20} hasHover={false} />
        <p className='font-josefin_Sans group-hover:ml-2 transition-all'>
          Bookmarks
        </p>
      </Link>

      <Link
        href='/settings'
        className='group flex w-full items-center justify-start gap-2 px-4 py-2'
      >
        <Icon name='RiSettings3Line' size={20} hasHover={false} />
        <p className='font-josefin_Sans group-hover:ml-2 transition-all'>
          Settings
        </p>
      </Link>

      <Link
        href='/profile/activity'
        className='group flex w-full items-center justify-start gap-2 px-4 py-2'
      >
        <Icon name='RiHistoryLine' size={20} hasHover={false} />
        <p className='font-josefin_Sans group-hover:ml-2 transition-all'>
          Activity
        </p>
      </Link>

      <div
        onClick={() => {
          signOut();
        }}
        className='group flex w-full items-center justify-start gap-2 px-4 py-2 transition-all text-alert-red cursor-pointer'
      >
        <Icon
          name='RiLogoutBoxRLine'
          size={20}
          className='text-alert-red'
          hasHover={false}
        />
        <p className='font-josefin_Sans group-hover:ml-1 transition-all'>
          Logout
        </p>
      </div>
    </div>
  );
};

export default UserOptions;
