import { TopicBadgeBlog } from '@/components/badges/topicBadge';

export const BlogTopics = ({ topics }: { topics: string[] }) => {
  return (
    <div className='space-y-3'>
      <h4 className='px-1 font-dm_sans font-medium'>Tagged topics</h4>

      <div className='flex items-center gap-2 flex-wrap'>
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
