import Link from 'next/link';

import { CREATE_ROUTE } from '@/constants/routeConstants';
import { Button } from '@the-monkeys/ui/atoms/button';

import Icon from '../icon';

export const CreateButton = () => {
  return (
    <Button
      variant='brand'
      size='icon'
      className='group rounded-full hover:text-text-dark hover:bg-opacity-100'
      asChild
    >
      <Link href={`${CREATE_ROUTE}`} title='Create Blog'>
        <Icon
          name='RiPencil'
          className='group-hover:animate-icon-shake'
          size={18}
        />
      </Link>
    </Button>
  );
};
