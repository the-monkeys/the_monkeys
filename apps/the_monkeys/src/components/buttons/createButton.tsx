import Link from 'next/link';

import { CREATE_ROUTE } from '@/constants/routeConstants';
import { Button } from '@the-monkeys/ui/atoms/button';

import Icon from '../icon';

export const CreateButton = () => {
  return (
    <Button className='group px-2 rounded-full md:rounded-md' asChild>
      <Link href={`${CREATE_ROUTE}`} title='Create Blog'>
        <Icon
          name='RiPencil'
          className='block md:hidden lg:block group-hover:animate-icon-shake'
        />

        <p className='hidden md:block px-1 font-dm_sans'>Create</p>
      </Link>
    </Button>
  );
};
