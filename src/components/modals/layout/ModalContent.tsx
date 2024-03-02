import React, { FC, PropsWithChildren } from 'react';

type ModalContentProps = {
  children: React.ReactNode;
};

const ModalContent: FC<PropsWithChildren<ModalContentProps>> = ({
  children,
}) => {
  return <div className='flex-1 p-2'>{children}</div>;
};

export default ModalContent;
