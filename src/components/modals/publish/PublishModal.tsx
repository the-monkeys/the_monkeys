'use client';

import React, { FC, useState } from 'react';

import { publishSteps } from '@/constants/modal';

import Modal from '..';
import ModalFooter from '../layout/ModalFooter';
import ModalHeader from '../layout/ModalHeader';
import BlogDetails from './BlogDetails';
import BlogTopics from './BlogTopics';

export type PublishStep = {
  id: number;
  heading: string;
  subHeading?: string;
};

type PublishModalProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const PublishModal: FC<PublishModalProps> = ({ setModal }) => {
  const [publishStep, setPublishStep] = useState<PublishStep>(publishSteps[0]);

  const handlePublishStep = () => {
    if (publishStep.id === 1)
      return <BlogDetails setPublishStep={setPublishStep} />;
    else if (publishStep.id === 2)
      return <BlogTopics setPublishStep={setPublishStep} />;
    else return <BlogDetails setPublishStep={setPublishStep} />;
  };

  return (
    <Modal setModal={setModal}>
      <ModalHeader
        showHeading
        heading={publishStep.heading}
        subHeading={publishStep.subHeading}
      />

      {handlePublishStep()}

      <ModalFooter>
        <p className='text-center font-jost text-sm'>
          <b>Important: </b>Modifications made here will solely affect the
          presentation of your blog, without altering the actual content of your
          blog.
        </p>
      </ModalFooter>
    </Modal>
  );
};

export default PublishModal;
