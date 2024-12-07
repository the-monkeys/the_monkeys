'use client';

import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import { publishSteps } from '@/constants/modal';

import ModalContent from '../layout/ModalContent';
import { PublishStep } from './PublishModal';

const Step2 = ({
  setPublishStep,
}: {
  setPublishStep: React.Dispatch<React.SetStateAction<PublishStep>>;
}) => {
  const handlePreviousStep = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setPublishStep(publishSteps[0]);
  };

  return (
    <ModalContent className='space-y-2'>
      <p className='font-dm_sans'>
        Choose topics (at most 5)
        <span className='block opacity-80 text-sm'>
          Topics provide readers with a glimpse into the content of your blog.
        </span>
      </p>

      <div className='flex items-center gap-2 flex-wrap'>
        {/* Added topics will show here */}

        <Button size='icon' variant='outline' className='rounded-full'>
          <Icon name='RiAdd' size={16} />
        </Button>
      </div>

      <div className='pt-6 flex gap-2 items-center'>
        <Button
          variant='secondary'
          className='flex-1'
          onClick={handlePreviousStep}
        >
          Previous
        </Button>

        <Button
          className='flex-1'
          onClick={() => setPublishStep(publishSteps[0])}
        >
          Publish
        </Button>
      </div>
    </ModalContent>
  );
};

export default Step2;
