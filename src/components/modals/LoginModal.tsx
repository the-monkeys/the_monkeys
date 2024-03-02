'use client';

import React, { FC } from 'react';
import Modal from '.';
import ModalHeader from './layout/ModalHeader';
import ModalContent from './layout/ModalContent';
import ModalFooter from './layout/ModalFooter';

type LoginModalProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginModal: FC<LoginModalProps> = ({ setModal }) => {
  return (
    <Modal setModal={setModal}>
      <ModalHeader showHeading setModal={setModal} />
      {/* <ModalContent>
        <p>Login modal content here</p>
      </ModalContent> */}
      {/* <ModalFooter>
        <p>Login modal footer here</p>
      </ModalFooter> */}
    </Modal>
  );
};

export default LoginModal;
