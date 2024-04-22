import React, { FC, SetStateAction } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon/Icon';

type UserOptionsProps = {
  setUserOptions: React.Dispatch<SetStateAction<boolean>>;
};

const UserOptions: FC<UserOptionsProps> = ({ setUserOptions }) => {
  return (
    <div
      className='pt-4 absolute top-full right-0 w-44'
      onMouseLeave={() => setUserOptions(false)}
    >
      <div className='flex h-fit max-h-[80vh] flex-col gap-2 overflow-hidden rounded-lg border-1 border-secondary-lightGrey/25 bg-primary-monkeyWhite py-2 dark:bg-primary-monkeyBlack drop-shadow-lg'>
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

        <div className='group flex w-full items-center justify-start gap-2 px-4 py-2 transition-all text-alert-red cursor-pointer'>
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
    </div>
  );
};

export default UserOptions;
