import { FC } from 'react';

import IconContainer from '@/components/icon';

type ModalHeaderProps = {
  heading?: string;
  subHeading?: string;
  showHeading?: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalHeader: FC<ModalHeaderProps> = ({
  heading = 'Welcome to Monkeys',
  showHeading,
  subHeading,
  setModal,
}) => {
  return (
    <div className='flex flex-col justify-center'>
      <div className='m-2 flex justify-end'>
        <IconContainer
          name='RiCloseLine'
          size={20}
          onClick={() => setModal(false)}
        />
      </div>
      {showHeading && (
        <div className='mt-4 flex flex-col gap-2'>
          <p className='text-center font-playfair_Display text-2xl sm:text-3xl font-semibold'>
            {heading}
          </p>
          <p className='text-center font-josefin_Sans'>{subHeading}</p>
        </div>
      )}
    </div>
  );
};

export default ModalHeader;
