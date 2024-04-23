'use client';

import React, { FC, useState } from 'react';

import Modal from '..';
import ModalFooter from '../layout/ModalFooter';
import ModalHeader from '../layout/ModalHeader';
import BlogDetails from './BlogDetails';

export type LoginStep = {
  id: number;
  heading: string;
  subHeading?: string;
};

type PublishModalProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const PublishModal: FC<PublishModalProps> = ({ setModal }) => {
  return (
    <Modal setModal={setModal}>
      <ModalHeader showHeading setModal={setModal} heading='Blog Details' />

      <BlogDetails />

      <ModalFooter>
        <p className='text-justify font-jost text-sm'>
          <b>Important: </b>Modifications made here will solely affect the
          presentation of your blog in prominent locations such as Monkeys's
          feed, without altering the actual content of your blog.
        </p>
      </ModalFooter>
    </Modal>
  );
};

export default PublishModal;
