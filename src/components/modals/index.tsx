import React, { FC, PropsWithChildren } from 'react';

import { useRouter } from 'next/navigation';

import IconContainer from '../icon';
import Logo from '../logo';

type ModalProps = {
  children?: React.ReactNode;
  setModal?: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal: FC<PropsWithChildren<ModalProps>> = ({ children, setModal }) => {
  const router = useRouter();
  return (
    <div className='fixed left-0 top-0 flex h-full w-full justify-center bg-secondary-white/60 backdrop-blur-sm dark:bg-secondary-darkGrey/60 z-50'>
      <div className='flex w-full flex-col items-start gap-1 self-end sm:max-w-md sm:self-center drop-shadow-xl'>
        <div className='w-full flex justify-between items-center px-2'>
          <Logo showMix />

          <IconContainer
            name='RiCloseLine'
            size={20}
            onClick={() => {
              router.back();
              if (setModal) {
                setModal(false);
              }
            }}
          />
        </div>

        <div className='flex max-h-[60vh] sm:max-h-[80vh] w-full flex-col gap-10 overflow-auto rounded-lg bg-primary-monkeyWhite transition-all dark:bg-primary-monkeyBlack sm:min-h-[300px] sm:self-center'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
