import { FC } from 'react';
import Icon from '../icon';

type ModalHeaderProps = {
  heading?: string;
  showHeading?: boolean;
};

const ModalHeader: FC<ModalHeaderProps> = ({ heading, showHeading }) => {
  return (
    <div className='flex flex-col justify-center gap-4'>
      <div className='flex justify-end p-1'>
        <Icon name='RiCloseLine' size={20} />
      </div>
      {showHeading && (
        <p className='text-center font-playfair_Display text-2xl font-semibold'>
          {heading}
        </p>
      )}
    </div>
  );
};

export default ModalHeader;
