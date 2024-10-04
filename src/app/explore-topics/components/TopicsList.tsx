import { useState } from 'react';

import { Button } from '@/components/ui/button';
// Adjust the import path as needed
import useUser from '@/hooks/useUser';
import { useSession } from 'next-auth/react';

import TopicButton from './TopicButton';

const TopicsList = ({ topics = [] }: { topics?: string[] }) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const displayedTopics = showAll ? topics : topics.slice(0, 6);
  const totalTopics = topics.length;

  const { user, isLoading, isError } = useUser(session?.user?.username);
  const followedTopics = user?.topics || [];

  const handleSuccess = () => {
    setLoading(false); // Reset loading state after a successful follow/unfollow
    // Optionally, trigger any state updates or data refetching here
  };

  return (
    <div>
      <ul className='pl-2 space-y-2'>
        {displayedTopics.map((topic) => (
          <li
            key={topic}
            className='flex items-center justify-between font-jost text-sm sm:text-base opacity-75'
          >
            <div>{topic}</div>
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
          className='w-full'
        >
          {showAll ? 'Show Less' : `Show All (${totalTopics})`}
        </Button>
      )}
    </div>
  );

  return null; // Or a loading/error state if needed
};

export default TopicsList;
