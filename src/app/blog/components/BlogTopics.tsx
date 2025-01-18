import { useState } from 'react';

import {
  TopicBadgeBlog,
  TopicBadgeShowcase,
  TopicBadgeShowcaseDefault,
} from '@/components/badges/topicBadge';

export const BlogTopics = ({ topics }: { topics: string[] }) => {
  return (
    <div className='space-y-3'>
      <h4 className='px-1 font-dm_sans font-medium'>Tagged topics</h4>

      <div className='flex items-center gap-1 flex-wrap'>
        {topics.length ? (
          topics?.map((topic, index) => (
            <TopicBadgeBlog key={index} topic={topic} />
          ))
        ) : (
          <p className='w-full text-sm opacity-80 text-center'>
            No topics available.
          </p>
        )}
      </div>
    </div>
  );
};

export const BlogTopicsCompact = ({ topics }: { topics: string[] }) => {
  const [showAllTopics, setShowAllTopics] = useState<boolean>(false);

  return (
    <div className='mt-3 relative flex gap-2 flex-wrap'>
      {topics.length ? (
        (showAllTopics ? topics : topics.slice(0, 5)).map((tag, index) => {
          return (
            <TopicBadgeShowcase
              key={index}
              topic={tag}
              colorCodeIndex={index}
            />
          );
        })
      ) : (
        <TopicBadgeShowcaseDefault />
      )}

      {topics.length > 6 && (
        <button
          className='px-1 text-sm opacity-80 hover:opacity-100 underline underline-offset-1 decoration-1'
          onClick={() => setShowAllTopics(!showAllTopics)}
        >
          {showAllTopics ? 'Show Less' : `Show All (${topics.length})`}
        </button>
      )}
    </div>
  );
};
