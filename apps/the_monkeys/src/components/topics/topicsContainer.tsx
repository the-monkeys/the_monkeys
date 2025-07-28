import { PROFILE_TOPICS_SHOW_MAX_COUNT } from '@/constants/topics';

import { TopicLabelLink } from './topicLabels';

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
