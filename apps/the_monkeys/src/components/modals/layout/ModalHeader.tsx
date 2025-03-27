import { FC, PropsWithChildren } from 'react';

import { twMerge } from 'tailwind-merge';

import { ModalComponentProps } from '..';

const ModalHeader: FC<PropsWithChildren<ModalComponentProps>> = ({
  children,
  className,
}) => {
  return <div className={twMerge(className, 'px-4 pt-5')}>{children}</div>;
};

export default ModalHeader;
