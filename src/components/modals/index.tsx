type ModalProps = {
  children: React.ReactNode;
  showHeaderLogo: boolean;
  className?: string;
};

const Modal = () => {
  return (
    <div className='fixed left-0 top-0 flex h-full w-screen items-center justify-center bg-secondary-white/60 backdrop-blur-sm dark:bg-secondary-darkGrey/60'>
      <div className='h-[60vh] w-full self-end bg-primary-monkeyWhite transition-all dark:bg-primary-monkeyBlack sm:w-52 sm:self-center'>
        sdfdsf
      </div>
    </div>
  );
};

export default Modal;
