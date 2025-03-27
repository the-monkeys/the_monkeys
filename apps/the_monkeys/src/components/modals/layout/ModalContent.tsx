import React, { FC, PropsWithChildren } from 'react';

import { twMerge } from 'tailwind-merge';

import { ModalComponentProps } from '..';

const ModalContent: FC<PropsWithChildren<ModalComponentProps>> = ({
  children,
  className,
}) => {
  return <div className={twMerge(className, 'p-4')}>{children}</div>;
};

export default ModalContent;
