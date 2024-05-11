// 'use client';
import { FC } from 'react';

type ModalHeaderProps = {
  heading?: string;
  subHeading?: string;
  showHeading?: boolean;
};

const ModalHeader: FC<ModalHeaderProps> = ({
  heading = 'Welcome to Monkeys',
  showHeading,
  subHeading,
}) => {
  return (
    <div className='flex flex-col justify-center'>
      {showHeading && (
        <div className='flex flex-col gap-2'>
          <p className='text-center font-playfair_Display text-2xl sm:text-3xl font-semibold'>
            {heading}
          </p>
          <p className='text-center font-josefin_Sans text-sm sm:text-base opacity-75'>
            {subHeading}
          </p>
        </div>
      )}
    </div>
  );
};

export default ModalHeader;
