import { ProfileTopicLinkContainer } from '@/components/topics/topicsContainer';

export const TopicsList = ({ topics = [] }: { topics?: string[] }) => {
  return (
    <div className='flex flex-col gap-3'>
      <h6 className='px-1 pb-1 font-dm_sans font-medium'>
        Author&apos;s interest
      </h6>

      <ProfileTopicLinkContainer topics={topics} />
    </div>
  );
};
