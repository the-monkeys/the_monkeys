import { useParams } from 'next/navigation';

import { TopicsContainerSkeleton } from '@/components/skeletons/blogSkeleton';
import { TopicLinksContainer } from '@/components/topics/topicsContainer';
import useUser from '@/hooks/user/useUser';

export const TopicsCard = () => {
  const params = useParams<{ username: string }>();

  const { user, isLoading, isError } = useUser(params.username);

  if (isLoading) {
    return <TopicsContainerSkeleton />;
  }

  if (isError) {
    return null;
  }

  return (
    <div className='flex flex-col gap-6'>
      <h6 className='px-1 pb-2 font-dm_sans font-semibold border-b-1 border-border-light dark:border-border-dark'>
        Topics of interest
      </h6>

      {user && <TopicLinksContainer maxShow={true} topics={user.topics} />}
    </div>
  );
};
