// 'use client';
import { FC } from 'react';

import { useRouter } from 'next/navigation';

import IconContainer from '@/components/icon';

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
  const router = useRouter();
  return (
    <div className='flex flex-col justify-center'>
      <div className='m-2 flex justify-end'>
        <IconContainer
          name='RiCloseLine'
          size={20}
          onClick={() => {
            router.back();
          }}
        />
      </div>
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
