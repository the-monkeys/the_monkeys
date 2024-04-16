import { FC } from 'react';

import Link from 'next/link';

import Button from '@/components/button';

type CreateButtonProps = {
  showTitle: boolean;
};

const CreateButton: FC<CreateButtonProps> = ({ showTitle }) => {
  return (
    <Link href='/create' className='flex flex-col items-center'>
      <Button
        title='Create'
        variant='circular'
        iconName='RiPencilLine'
        animateIcon
      />
      {showTitle && <p className='font-playfair_Display font-medium'>Create</p>}
    </Link>
  );
};

export default CreateButton;
