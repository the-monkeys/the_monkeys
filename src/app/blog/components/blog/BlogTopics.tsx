import { TopicBadgeBlog } from '@/components/badges/topicBadge';
import { Separator } from '@/components/ui/separator';

export const BlogTopics = ({ topics }: { topics: string[] }) => {
  return (
    <div>
      <h4 className='px-1 font-dm_sans font-medium'>Tagged topics</h4>

      <Separator className='mt-1 mb-3' />

      <div className='flex items-center gap-1 flex-wrap'>
        {topics.length ? (
          topics?.map((topic, index) => (
            <TopicBadgeBlog key={index} topic={topic} />
          ))
        ) : (
          <p className='w-full text-sm opacity-80 text-center'>
            No topics available.
          </p>
        )}
      </div>
    </div>
  );
};
