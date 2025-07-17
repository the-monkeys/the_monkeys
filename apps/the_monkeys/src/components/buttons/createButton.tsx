import Link from 'next/link';

import { CREATE_ROUTE } from '@/constants/routeConstants';

export const CreateButton = () => {
  return (
    <Link
      href={`${CREATE_ROUTE}`}
      title='Create Post'
      className='flex px-[10px] py-[6px] text-white bg-brand-orange rounded-sm hover:bg-opacity-85'
    >
      <p className='font-dm_sans font-medium'>Create</p>
    </Link>
  );
};
