import { useParams } from 'next/navigation';

import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { TopicLinksContainer } from '@/components/topics/topicsContainer';
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

      {user && <TopicLinksContainer maxShow={true} topics={user.topics} />}
    </div>
  );
};
