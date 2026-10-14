import { useState } from 'react';

import Link from 'next/link';

import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';
import { createTopicUrl } from '@/utils/topicUtils';
import { Button } from '@the-monkeys/ui/atoms/button';

import { TopicButton } from './TopicButton';

export const TopicsList = ({
  topics = [],
  followedTopics = [],
  user,
}: {
  topics?: string[];
  followedTopics?: string[];
  user?: GetPublicUserProfileApiResponse;
}) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const totalTopics = topics.length;
  const visibleTopics = showAll ? topics : topics.slice(0, 6);

  const handleSuccess = () => {
    setLoading(false);
  };

  return (
    <div className='space-y-4'>
      <ul className='pl-2 space-y-1'>
        {visibleTopics.map((topic) => (
          <li key={topic} className='group flex items-center justify-between'>
            <div className='flex-1'>
              <Link
                href={createTopicUrl(topic)}
                className='text-sm opacity-80 group-hover:opacity-100 truncate'
              >
                {topic}
              </Link>
            </div>

            {user && (
              <TopicButton
                topic={topic}
                isFollowed={followedTopics.includes(topic)}
                loading={loading}
                onSuccess={handleSuccess}
                user={user}
              />
            )}
          </li>
        ))}
      </ul>

      {totalTopics > 6 && (
        <Button
          size='sm'
          variant='ghost'
          onClick={() => setShowAll((prev) => !prev)}
          className='w-full'
        >
          {showAll ? 'Show Less' : `Show All (${totalTopics})`}
        </Button>
      )}
    </div>
  );
};
