'use client';

import { FC, useState } from 'react';

import Input from '@/components/input';
import { Button } from '@/components/ui/button';
import { publishSteps } from '@/constants/modal';

import { PublishStep } from './PublishModal';

type BlogDetailsProps = {
  setPublishStep: React.Dispatch<React.SetStateAction<PublishStep>>;
};

const BlogDetails: FC<BlogDetailsProps> = ({ setPublishStep }) => {
  const [blogTitle, setBlogTitle] = useState<string>('');
  const [blogSubheading, setBlogSubheading] = useState<string>('');

  return (
    <div className='px-4 py-2 flex flex-col gap-4'>
      <Input
        label='Title'
        placeholderText='Add preview title'
        variant='ghost'
        setInputText={setBlogTitle}
        className='w-full text-2xl'
      />

      <Input
        label='Subheading'
        placeholderText='Add preview subheading'
        variant='ghost'
        setInputText={setBlogSubheading}
        className='w-full'
      />

      <div className='mt-4 flex flex-col gap-2'>
        <div className='w-full sm:w-auto flex gap-2'>
          <Button variant='secondary'>Save as Draft</Button>

          <Button
            variant='secondary'
            onClick={() => setPublishStep(publishSteps[1])}
          >
            Add Topics
          </Button>
        </div>

        <Button>Publish Blog</Button>
      </div>
    </div>
  );
};

export default BlogDetails;
