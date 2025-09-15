import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { TopicLinksContainerCompact } from '@/components/topics/topicsContainer';
import { TOPIC_ROUTE } from '@/constants/routeConstants';

export const TopicsList = ({ topics = [] }: { topics?: string[] }) => {
  return (
    <div className='h-full flex flex-col justify-between items-center gap-8'>
      <div className='w-full space-y-4'>
        <h6 className='font-dm_sans font-medium text-lg'>
          Author&apos;s interest
        </h6>

        <TopicLinksContainerCompact topics={topics} />
      </div>

      <LinksRedirectArrow target='_blank' link={`${TOPIC_ROUTE}/explore`}>
        <p className='text-sm'>Explore more topics</p>
      </LinksRedirectArrow>
    </div>
  );
};
