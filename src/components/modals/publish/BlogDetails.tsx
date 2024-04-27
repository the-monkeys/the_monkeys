'use client';

import { FC, useState } from 'react';

import Button from '@/components/button';
import Input from '@/components/input';

import { PublishStep } from './PublishModal';
import { publishSteps } from './publishSteps';

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

      <div className='mt-4 flex items-center gap-2 flex-wrap'>
        <Button
          title='Save as Draft'
          variant='secondary'
          className='flex-grow'
        />
        <Button
          title='Add Topics'
          variant='secondary'
          className='flex-grow'
          onClick={() => setPublishStep(publishSteps[1])}
        />
        <Button
          title='Publish'
          variant='primary'
          className='w-full'
          iconName='RiArrowRightUpLine'
          endIcon
        />
      </div>
    </div>
  );
};

export default BlogDetails;
