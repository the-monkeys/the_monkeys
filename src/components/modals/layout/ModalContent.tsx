import React, { FC, PropsWithChildren } from 'react';

import { twMerge } from 'tailwind-merge';

type ModalContentProps = {
  className?: string;
  children: React.ReactNode;
};

const ModalContent: FC<PropsWithChildren<ModalContentProps>> = ({
  children,
  className,
}) => {
  return <div className={twMerge(className, 'flex-1')}>{children}</div>;
};

export default ModalContent;
