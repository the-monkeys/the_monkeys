'use client';

import { FC, useState } from 'react';

import TopicChip from '@/components/chip/TopicChip';
import SearchBox from '@/components/searchBox';
import { Button } from '@/components/ui/button';
import { publishSteps } from '@/constants/modal';
import { BlogTopic, dummyTopics } from '@/constants/topics';

import { PublishStep } from './PublishModal';

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

      <div className='mt-4 flex flex-col gap-2'>
        <div className='w-full sm:w-auto flex gap-2'>
          <Button
            variant='secondary'
            onClick={() => setPublishStep(publishSteps[0])}
          >
            Previous
          </Button>

          <Button variant='secondary'>Previous</Button>
        </div>

        <Button>Publish Blog</Button>
      </div>
    </div>
  );
};

export default BlogTopics;
