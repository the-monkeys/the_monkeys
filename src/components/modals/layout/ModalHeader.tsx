import { FC } from 'react';
import Icon from '../../icon';

type ModalHeaderProps = {
  heading?: string;
  showHeading?: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalHeader: FC<ModalHeaderProps> = ({
  heading = 'Welcome to Monkeys',
  showHeading,
  setModal,
}) => {
  return (
    <div className='flex flex-col justify-center gap-4'>
      <div className='m-2 flex justify-end'>
        <Icon name='RiCloseLine' size={20} onClick={() => setModal(false)} />
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
