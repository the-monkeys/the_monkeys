'use client';

import { useState } from 'react';

import { publishSteps } from '@/constants/modal';

import Modal from '..';
import ModalFooter from '../layout/ModalFooter';
import ModalHeader from '../layout/ModalHeader';
import PublishStep1 from './step1';
import PublishStep2 from './step2';

export type PublishStep = {
  id: number;
  heading: string;
  subHeading?: string;
};

const PublishModal = ({
  setModal,
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [publishStep, setPublishStep] = useState<PublishStep>(publishSteps[0]);

  const handlePublishStep = () => {
    if (publishStep.id === 1)
      return <PublishStep1 setPublishStep={setPublishStep} />;
    else return <PublishStep2 setPublishStep={setPublishStep} />;
  };

  return (
    <Modal setModal={setModal}>
      <ModalHeader>
        <h1 className='font-playfair_Display text-2xl sm:text-3xl text-center font-semibold'>
          {publishStep?.heading}
        </h1>

        {publishStep.subHeading && (
          <p className='mt-2 font-jost text-sm sm:text-base opacity-75 text-center'>
            {publishStep.subHeading}
          </p>
        )}
      </ModalHeader>

      {handlePublishStep()}

      <ModalFooter>
        <p className='text-center font-jost text-sm opacity-75'>
          Modifications made here will solely affect the presentation of your
          blog, without altering the actual content of your blog.
        </p>
      </ModalFooter>
    </Modal>
  );
};

export default PublishModal;
