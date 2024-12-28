import { useState } from 'react';

import { Button } from '@/components/ui/button';
import useUser from '@/hooks/user/useUser';
import { useSession } from 'next-auth/react';

import { TopicButton } from './TopicButton';

export const TopicsList = ({ topics = [] }: { topics?: string[] }) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const displayedTopics = showAll ? topics : topics.slice(0, 6);
  const totalTopics = topics.length;

  const { user, isLoading, isError } = useUser(session?.user?.username);
  const followedTopics = user?.topics || [];

  const handleSuccess = () => {
    setLoading(false);
  };

  return (
    <div className='pt-2 space-y-2'>
      <ul className='pl-2 pr-1 space-y-1'>
        {displayedTopics.map((topic) => (
          <li key={topic} className='group flex items-center justify-between'>
            <p className='py-1 flex-1 opacity-80 group-hover:opacity-100'>
              {topic}
            </p>

            <TopicButton
              topic={topic}
              isFollowed={followedTopics.includes(topic)}
              loading={loading}
              onSuccess={handleSuccess}
            />
          </li>
        ))}
      </ul>

      {totalTopics > 6 && (
        <Button
          size='sm'
          variant='link'
          onClick={() => setShowAll((prev) => !prev)}
          className='w-full rounded-none'
        >
          {showAll ? 'Show Less' : `Show All (${totalTopics})`}
        </Button>
      )}
    </div>
  );
};
