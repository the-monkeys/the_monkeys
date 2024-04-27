'use client';

import { FC, useState } from 'react';

import Button from '@/components/button';
import SearchBox from '@/components/searchBox';

import { PublishStep } from './PublishModal';
import { publishSteps } from './publishSteps';

type BlogTopicsProps = {
  setPublishStep: React.Dispatch<React.SetStateAction<PublishStep>>;
};

type BlogTopic = {
  id: number;
  topic: string;
};

const BlogTopics: FC<BlogTopicsProps> = ({ setPublishStep }) => {
  const [topicInput, setTopicInput] = useState<string>('');
  const [blogTopics, setBlogTopics] = useState<BlogTopic[]>([]);

  return (
    <div className='px-4 py-2 flex flex-col gap-4'>
      <p className='font-josefin_Sans'>
        Add topics (at most 5)
        <span className='block opacity-75 text-sm'>
          Topics provide readers with a glimpse into the content of your blog.
        </span>
      </p>

      <SearchBox
        placeholder='Add topics'
        setSearchInput={setTopicInput}
        className='flex-grow'
        showIcon={false}
      />

      <div className='flex gap-1 flex-wrap'></div>

      <div className='mt-4 flex flex-col gap-2'>
        <div className='w-full sm:w-auto flex gap-2'>
          <Button
            title='Previous'
            variant='secondary'
            className='w-1/2'
            onClick={() => setPublishStep(publishSteps[0])}
          />
          <Button title='Save as Draft' variant='secondary' className='w-1/2' />
        </div>

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

export default BlogTopics;
