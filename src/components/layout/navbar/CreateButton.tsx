import { FC } from 'react';

import Button from '@/components/button';

type CreateButtonProps = {
  showTitle: boolean;
};

const CreateButton: FC<CreateButtonProps> = ({ showTitle }) => {
  return (
    <div className='flex flex-col items-center'>
      <Button
        title='Create'
        variant='circular'
        iconName='RiPencilLine'
        animateIcon
      />
      {showTitle && <p className='font-playfair_Display font-medium'>Create</p>}
    </div>
  );
};

export default CreateButton;
