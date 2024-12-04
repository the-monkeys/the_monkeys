import { useParams } from 'next/navigation';

import { TopicBadgeProfile } from '@/components/buttons/topicBadge';
import { Loader } from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import useUser from '@/hooks/user/useUser';
import { useSession } from 'next-auth/react';

export const TopicsCard = () => {
  const params = useParams<{ username: string }>();

  const { user, isLoading, isError } = useUser(params.username);

  if (isLoading) {
    return <Loader className='m-auto' />;
  }

  const topicsCount = user?.topics?.length || 0;
  const maxTopicsShow = 5;

  return (
    <div className='mt-4'>
      <h2 className='mb-2 font-dm_sans font-medium text-lg sm:text-xl'>
        Topics
      </h2>

      {user && user.topics && user.topics.length > 0 ? (
        <div className='py-2 flex flex-wrap gap-x-1 gap-y-2'>
          {user.topics
            ?.slice(0, maxTopicsShow)
            .map((topic, index) => (
              <TopicBadgeProfile key={index} topic={topic} />
            ))}

          {topicsCount > maxTopicsShow ? (
            <p className='px-1 self-center font-roboto text-sm opacity-75'>
              {`+${topicsCount} more`}
            </p>
          ) : null}
        </div>
      ) : (
        <p className='font-roboto text-sm opacity-80 italic'>
          No topics have been added.
        </p>
      )}
    </div>
  );
};
