import React, { FC, SetStateAction } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Icon from '@/components/icon/Icon';
import { signOut } from 'next-auth/react';

type UserOptionsProps = {
  setUserOptions: React.Dispatch<SetStateAction<boolean>>;
};

const UserOptions: FC<UserOptionsProps> = () => {
  const router = useRouter();
  return (
    <div className='pt-4 absolute top-full right-0 w-44'>
      <div className='flex h-fit max-h-[80vh] flex-col overflow-hidden rounded-lg border-1 border-secondary-lightGrey/25 bg-primary-monkeyWhite py-2 dark:bg-primary-monkeyBlack drop-shadow-lg'>
        <Link
          href='/profile'
          className='flex w-full items-center justify-start gap-2 px-4 py-2 border-t-1 border-b-1 border-secondary-lightGrey/0 hover:border-secondary-lightGrey/25'
        >
          <Icon name='RiUserLine' size={20} hasHover={false} />
          <p className='font-josefin_Sans'>Profile</p>
        </Link>

        <Link
          href='/drafts'
          className='flex w-full items-center justify-start gap-2 px-4 py-2 border-t-1 border-b-1 border-secondary-lightGrey/0 hover:border-secondary-lightGrey/25'
        >
          <Icon name='RiDraftLine' size={20} hasHover={false} />
          <p className='font-josefin_Sans'>Drafts</p>
        </Link>

        <Link
          href='/settings'
          className='flex w-full items-center justify-start gap-2 px-4 py-2 border-t-1 border-b-1 border-secondary-lightGrey/0 hover:border-secondary-lightGrey/25'
        >
          <Icon name='RiSettings3Line' size={20} hasHover={false} />
          <p className='font-josefin_Sans'>Settings</p>
        </Link>

        <Link
          href='/profile/activity'
          className='flex w-full items-center justify-start gap-2 px-4 py-2 border-t-1 border-b-1 border-secondary-lightGrey/0 hover:border-secondary-lightGrey/25'
        >
          <Icon name='RiHistoryLine' size={20} hasHover={false} />
          <p className='font-josefin_Sans'>Activity</p>
        </Link>

        <div
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              router.push('/'); // Redirect to the dashboard page after signing out
            });
          }}
          className='flex w-full items-center justify-start gap-2 px-4 py-2 transition-all text-alert-red cursor-pointer border-t-1 border-b-1 border-alert-red/0 hover:border-alert-red/25'
        >
          <Icon
            name='RiLogoutBoxRLine'
            size={20}
            className='text-alert-red'
            hasHover={false}
          />
          <p className='font-josefin_Sans'>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default UserOptions;
