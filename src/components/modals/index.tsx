import React, { FC, PropsWithChildren } from 'react';
import Logo from '../logo';

type ModalProps = {
  children?: React.ReactNode;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal: FC<PropsWithChildren<ModalProps>> = ({ children, setModal }) => {
  return (
    <div
      className='fixed left-0 top-0 flex h-full w-full items-center justify-center bg-secondary-white/60 backdrop-blur-sm dark:bg-secondary-darkGrey/60'
      onClick={() => setModal(false)}
    >
      <div className='flex w-full flex-col items-start gap-1 sm:max-w-md sm:self-center'>
        <div className='flex h-[60vh] w-full flex-col gap-2 rounded-lg bg-primary-monkeyWhite transition-all dark:bg-primary-monkeyBlack sm:h-[500px] sm:self-center'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
