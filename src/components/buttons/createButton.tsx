import Link from 'next/link';

import Icon from '../icon';
import { Button } from '../ui/button';

export const CreateButton = () => {
  return (
    <Button
      variant='brand'
      asChild
      className='group rounded-full hover:text-text-dark hover:bg-opacity-100'
    >
      <Link href='/create' title='Create Blogs Here'>
        <Icon
          name='RiPencil'
          className='mr-2 group-hover:animate-icon-shake'
          size={18}
        />
        Create
      </Link>
    </Button>
  );
};
