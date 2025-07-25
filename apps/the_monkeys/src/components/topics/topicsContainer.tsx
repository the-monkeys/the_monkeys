import { useState } from 'react';

import {
  BLOG_TOPICS_SHOW_MAX_COUNT,
  PROFILE_TOPICS_SHOW_MAX_COUNT,
} from '@/constants/topics';

import { TopicLabelLink, TopicLabelLinkHash } from './topicLabels';

export const TopicLinksContainer = ({
  maxShow = false,
  topics,
}: {
  maxShow?: boolean;
  topics?: string[];
}) => {
  if (!topics || !topics.length)
    return (
      <p className='text-sm opacity-80 text-center'>
        No topics have been added.
      </p>
    );

  const maxTopicsShow = maxShow ? PROFILE_TOPICS_SHOW_MAX_COUNT : undefined;

  return (
    <div className='flex items-center gap-2 flex-wrap'>
      {topics.slice(0, maxTopicsShow).map((topic, index) => (
        <TopicLabelLink key={`${topic}_${index}`} topic={topic} />
      ))}
    </div>
  );
};

export const HashTopicLinksContainer = ({ topics }: { topics?: string[] }) => {
  const [showAllTopics, setShowAllTopics] = useState<boolean>(false);

  if (!topics || !topics.length)
    return <p className='text-sm opacity-80'>No topics have been added.</p>;

  return (
    <div className='flex items-center gap-x-2 gap-y-1 flex-wrap'>
      {(showAllTopics
        ? topics
        : topics.slice(0, BLOG_TOPICS_SHOW_MAX_COUNT)
      ).map((topic, index) => {
        return (
          <TopicLabelLinkHash
            key={`${topic}_${index}`}
            colorCodeIndex={index}
            topic={topic}
          />
        );
      })}

      {topics.length > BLOG_TOPICS_SHOW_MAX_COUNT && (
        <button
          className='px-1 text-sm hover:opacity-80 underline underline-offset-2 decoration-1'
          onClick={() => setShowAllTopics(!showAllTopics)}
        >
          {showAllTopics ? 'show less' : 'show more'}
        </button>
      )}
    </div>
  );
};
