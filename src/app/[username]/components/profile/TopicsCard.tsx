import { useParams } from 'next/navigation';

import { TopicBadgeProfile } from '@/components/badges/topicBadge';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { Separator } from '@/components/ui/separator';
import useUser from '@/hooks/user/useUser';

export const TopicsCard = () => {
  const params = useParams<{ username: string }>();

  const { user, isLoading, isError } = useUser(params.username);

  if (isLoading) {
    return null;
  }

  const topicsCount = user?.topics?.length || 0;
  const maxTopicsShow = 5;

  return (
    <div className='mt-4'>
      <LinksRedirectArrow link='/explore-topics'>
        <h2 className='px-1 font-dm_sans font-medium text-base sm:text-lg'>
          Topics
        </h2>
      </LinksRedirectArrow>

      <Separator className='mt-1 mb-4' />

      {user && user.topics && user.topics.length > 0 ? (
        <div className='flex flex-wrap gap-x-1 gap-y-2'>
          {user.topics
            ?.slice(0, maxTopicsShow)
            .map((topic, index) => (
              <TopicBadgeProfile key={index} topic={topic} />
            ))}

          {topicsCount > maxTopicsShow ? (
            <p className='px-1 self-center font-roboto text-sm opacity-80'>
              {`+${topicsCount - maxTopicsShow} more`}
            </p>
          ) : null}
        </div>
      ) : (
        <p className='font-roboto text-sm opacity-80 text-center'>
          No topics have been added.
        </p>
      )}
    </div>
  );
};
