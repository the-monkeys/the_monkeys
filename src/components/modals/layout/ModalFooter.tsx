import React, { FC, PropsWithChildren } from 'react';

type ModalFooterProps = {
  children: React.ReactNode;
};

const ModalFooter: FC<PropsWithChildren<ModalFooterProps>> = ({ children }) => {
  return <div className='py-4'>{children}</div>;
};

export default ModalFooter;
