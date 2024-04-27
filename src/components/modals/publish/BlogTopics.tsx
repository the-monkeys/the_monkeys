'use client';

import { FC, useState } from 'react';

import Button from '@/components/button';
import TopicChip from '@/components/chip/TopicChip';
import SearchBox from '@/components/searchBox';
import { BlogTopic, dummyTopics } from '@/constants/topics';

import { PublishStep } from './PublishModal';
import { publishSteps } from './publishSteps';

type BlogTopicsProps = {
  setPublishStep: React.Dispatch<React.SetStateAction<PublishStep>>;
};

const BlogTopics: FC<BlogTopicsProps> = ({ setPublishStep }) => {
  const [topicInput, setTopicInput] = useState<string>('');
  const [blogTopics, setBlogTopics] = useState<BlogTopic[]>(dummyTopics);

  const handleTopicRemove = (topicId: number) => {
    const updatedTopics = blogTopics.filter((topic) => topic.id !== topicId);

    setBlogTopics(updatedTopics);
  };

  return (
    <div className='px-4 py-2 flex flex-col gap-4'>
      <p className='font-josefin_Sans'>
        Choose topics (at most 5)
        <span className='block opacity-75 text-sm'>
          Topics provide readers with a glimpse into the content of your blog.
        </span>
      </p>

      {blogTopics.length > 0 && (
        <div className='flex gap-2 flex-wrap'>
          {blogTopics.map((topic) => {
            return (
              <TopicChip
                key={topic.id}
                data={topic}
                onRemove={handleTopicRemove}
              />
            );
          })}
        </div>
      )}

      <SearchBox
        placeholder='Add topics'
        setSearchInput={setTopicInput}
        className='flex-grow'
        showIcon={false}
        disabled={blogTopics.length >= 5}
        disabledPlaceholder='At most 5 topics allowed'
      />

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
