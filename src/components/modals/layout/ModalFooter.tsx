import React, { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type ModalFooterProps = {
  className?: string;
  children: React.ReactNode;
};

const ModalFooter: FC<PropsWithChildren<ModalFooterProps>> = ({
  children,
  className,
}) => {
  return (
    <div className='px-2 py-4'>
      <div className={twMerge(className, 'mx-auto w-4/5')}>{children}</div>
    </div>
  );
};

export default ModalFooter;
