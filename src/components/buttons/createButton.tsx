import Link from 'next/link';

import Icon from '../icon';
import { Button } from '../ui/button';

const CreateButton = () => {
  return (
    <Button
      size='icon'
      asChild
      className='group rounded-full hover:bg-opacity-100'
    >
      <Link href='/create' className='flex flex-col items-center'>
        <Icon
          name='RiPencil'
          className='group-hover:animate-shake text-secondary-white'
        />
      </Link>
    </Button>
  );
};

export default CreateButton;
