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

  if (isError) {
    return null;
  }

  const topicsCount = user?.topics?.length || 0;
  const maxTopicsShow = 6;

  return (
    <div className='mt-6'>
      <div className='flex flex-col'>
        <h4 className='font-dm_sans font-medium text-base md:text-lg'>
          Topics of interest
        </h4>

        <LinksRedirectArrow link='/topics/explore' className='w-fit'>
          <p className='font-dm_sans text-sm opacity-80'>explore topics</p>
        </LinksRedirectArrow>
      </div>

      <Separator className='mt-1 mb-3' />

      {user && user.topics && user.topics.length > 0 ? (
        <div className='mt-2 flex flex-wrap gap-2'>
          {user.topics
            ?.slice(0, maxTopicsShow)
            .map((topic, index) => (
              <TopicBadgeProfile key={index} topic={topic} />
            ))}

          {topicsCount > maxTopicsShow ? (
            <p className='px-1 self-center text-xs md:text-sm opacity-80'>
              {`+${topicsCount - maxTopicsShow} more`}
            </p>
          ) : null}
        </div>
      ) : (
        <p className='text-sm opacity-80 text-center'>
          No topics have been added.
        </p>
      )}
    </div>
  );
};
