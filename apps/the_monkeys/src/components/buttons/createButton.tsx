import Link from 'next/link';

import { CREATE_ROUTE } from '@/constants/routeConstants';

import Icon from '../icon';

export const CreateButton = () => {
  return (
    <Link
      href={`${CREATE_ROUTE}`}
      title='Create Post'
      className='group h-9 flex items-center gap-1 px-[6px] sm:px-4 py-[6px] border-2 border-brand-orange text-white bg-brand-orange rounded-full hover:bg-brand-orange/20 hover:text-brand-orange'
    >
      <Icon
        name='RiPencil'
        className='block sm:hidden group-hover:animate-icon-shake'
      />

      <p className='hidden sm:block font-dm_sans font-medium'>Create</p>
    </Link>
  );
};
