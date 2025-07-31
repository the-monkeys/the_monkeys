import Link from 'next/link';

import { CREATE_ROUTE } from '@/constants/routeConstants';

import Icon from '../icon';

export const CreateButton = () => {
  return (
    <Link
      href={`${CREATE_ROUTE}`}
      title='Create Post'
      className='group h-9 flex items-center gap-1 px-2 sm:px-4 py-[6px] text-text-dark dark:text-text-light bg-background-dark dark:bg-background-light rounded-full hover:bg-opacity-85'
    >
      <Icon
        name='RiPencil'
        className='block sm:hidden group-hover:animate-icon-shake'
      />

      <p className='hidden sm:block font-dm_sans font-medium'>Create</p>
    </Link>
  );
};
