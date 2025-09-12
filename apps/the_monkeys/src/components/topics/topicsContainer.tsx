import Link from 'next/link';

import { PROFILE_TOPICS_SHOW_MAX_COUNT } from '@/constants/topics';
import { Badge } from '@the-monkeys/ui/atoms/badge';

import { TopicLabelLink, TopicLabelLinkProfile } from './topicLabels';
import TopicListDialog from './topicListDialog';

export const TopicLinksContainer = ({ topics }: { topics?: string[] }) => {
  if (!topics || !topics.length)
    return (
      <p className='text-sm opacity-80 text-center'>
        No topics have been added.
      </p>
    );

  return (
    <div className='flex items-center gap-2 flex-wrap'>
      {topics.map((topic, index) => (
        <TopicLabelLink key={`${topic}_${index}`} topic={topic} />
      ))}
    </div>
  );
};

export const TopicLinksContainerCompact = ({
  topics,
}: {
  topics?: string[];
}) => {
  if (!topics || !topics.length)
    return (
      <p className='text-sm opacity-80 text-center'>
        No topics have been added.
      </p>
    );

  return (
    <div className='flex items-center gap-2 flex-wrap'>
      {topics.slice(0, PROFILE_TOPICS_SHOW_MAX_COUNT).map((topic, index) => (
        <TopicLabelLinkProfile key={`${topic}_${index}`} topic={topic} />
      ))}

      {topics.length > PROFILE_TOPICS_SHOW_MAX_COUNT && (
        <TopicListDialog topics={topics} />
      )}
    </div>
  );
};
