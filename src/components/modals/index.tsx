import { FC, PropsWithChildren } from 'react';
import ModalHeader from './ModalHeader';
import Logo from '../logo';
import ModalFooter, { ModalFooterVariants } from './ModalFooter';

type ModalProps = {
  className?: string;
  children?: React.ReactNode;
  footerVariant: ModalFooterVariants;
};

const Modal: FC<PropsWithChildren<ModalProps>> = ({ children }) => {
  return (
    <div className='fixed left-0 top-0 flex h-full w-screen items-center justify-center bg-secondary-white/60 px-1 backdrop-blur-sm dark:bg-secondary-darkGrey/60'>
      <div className='mx-auto flex w-full flex-col items-start gap-1 self-end sm:max-w-lg sm:self-center'>
        <div className='ml-2'>
          <Logo showMix />
        </div>
        <div className='h-[60vh] w-full rounded-lg border-1 border-secondary-lightGrey/25 bg-primary-monkeyWhite transition-all dark:bg-primary-monkeyBlack sm:self-center'>
          <ModalHeader heading='Welcome Back' showHeading />
          {children}
          <ModalFooter />
        </div>
      </div>
    </div>
  );
};

export default Modal;
