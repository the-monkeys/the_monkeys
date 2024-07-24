import { useState } from 'react';

import { Button } from '@/components/ui/button';

const TopicsList = ({ topics }: { topics?: string[] }) => {
  const [showAll, setShowAll] = useState<boolean>(false);

  const displayedTopics = showAll ? topics : topics?.slice(0, 6);
  const totalTopics = topics?.length || 0;

  return (
    <div>
      <ul className='pl-2 space-y-2'>
        {displayedTopics?.map((topic) => (
          <li key={topic} className='font-jost text-sm sm:text-base opacity-75'>
            {topic}
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
};

export default TopicsList;
