import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { TopicLinksContainerCompact } from '@/components/topics/topicsContainer';
import { TOPIC_ROUTE } from '@/constants/routeConstants';

export const TopicsList = ({ topics = [] }: { topics?: string[] }) => {
  return (
    <div className='h-full flex flex-col justify-between items-center gap-4'>
      <div className='w-full space-y-3'>
        <h6 className='px-1 pb-1 font-dm_sans font-medium text-lg'>
          Author&apos;s interest
        </h6>

        <TopicLinksContainerCompact topics={topics} />
      </div>

      <LinksRedirectArrow target='_blank' link={`${TOPIC_ROUTE}/explore`}>
        <p className='text-sm'>Explore topics</p>
      </LinksRedirectArrow>
    </div>
  );
};
