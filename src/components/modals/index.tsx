import {
  Dispatch,
  FC,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useEffect,
} from 'react';

import Icon from '../icon';
import Logo from '../logo';

type ModalProps = {
  children?: ReactNode;
  setModal?: Dispatch<SetStateAction<boolean>>;
};

export type ModalComponentProps = {
  className?: string;
  children: React.ReactNode;
};

const Modal: FC<PropsWithChildren<ModalProps>> = ({ children, setModal }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className='fixed left-0 top-0 flex h-full w-full justify-center bg-foreground-light/80 backdrop-blur-sm dark:bg-foreground-dark/80 z-50'>
      <div className='flex w-full flex-col items-start gap-1 self-end sm:max-w-md sm:self-center drop-shadow-xl'>
        <div className='w-full flex justify-between items-center px-2'>
          <Logo />

          <div
            className='hover:opacity-80 cursor-pointer'
            onClick={() => {
              if (setModal) {
                setModal(false);
              }
            }}
          >
            <Icon name='RiClose' />
          </div>
        </div>

        <div className='space-y-6 max-h-[60vh] sm:max-h-[80vh] w-full flex-col overflow-auto rounded-md bg-background-light transition-all dark:bg-background-dark sm:min-h-[300px] sm:self-center'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
