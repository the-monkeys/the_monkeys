import React, { FC, PropsWithChildren } from 'react';

import { twMerge } from 'tailwind-merge';

import { ModalComponentProps } from '..';

const ModalFooter: FC<PropsWithChildren<ModalComponentProps>> = ({
  children,
  className,
}) => {
  return <div className={twMerge(className, 'px-4 pb-5')}>{children}</div>;
};

export default ModalFooter;
