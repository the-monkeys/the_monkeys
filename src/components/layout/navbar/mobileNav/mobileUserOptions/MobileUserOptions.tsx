import Icon from '@/components/icon';
import Link from 'next/link';

const MobileUserOptions = () => {
  return (
    <div className='absolute -right-8 bottom-full mb-2 flex h-fit max-h-[80vh] w-48 flex-col overflow-hidden rounded-lg border-1 border-secondary-lightGrey/25 bg-primary-monkeyWhite transition-all dark:bg-primary-monkeyBlack'>
      <div className='flex flex-col gap-2 py-2'>
        <Link
          href='/profile'
          className='flex w-full items-center justify-start gap-2 px-4 py-2 transition-all hover:gap-3'
        >
          <Icon name='RiUser3Line' size={20} />
          <p className='font-josefin_Sans'>Profile</p>
        </Link>

        <Link
          href='/settings'
          className='flex w-full items-center justify-start gap-2 px-4 py-2 transition-all hover:gap-3'
        >
          <Icon name='RiSettings3Line' size={20} />
          <p className='font-josefin_Sans'>Account Settings</p>
        </Link>

        <Link
          href='/profile/activity'
          className='flex w-full items-center justify-start gap-2 px-4 py-2 transition-all hover:gap-3'
        >
          <Icon name='RiHistoryLine' size={20} />
          <p className='font-josefin_Sans'>Activity Logs</p>
        </Link>
      </div>
    </div>
  );
};

export default MobileUserOptions;
