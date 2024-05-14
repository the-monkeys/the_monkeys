import { FC } from 'react';

import Link from 'next/link';

import Icon from '../icon/Icon';

type CreateButtonProps = {
  showTitle: boolean;
};

const CreateButton: FC<CreateButtonProps> = ({ showTitle }) => {
  return (
    <Link href='/create' className='flex flex-col items-center'>
      <div className='group flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary-monkeyOrange transition-all'>
        <Icon
          name='RiPencilLine'
          className='group-hover:animate-shake text-secondary-white'
        />
      </div>
      {showTitle && <p className='font-playfair_Display font-medium'>Create</p>}
    </Link>
  );
};

export default CreateButton;
