import { TopicBadgeBlog } from '@/components/badges/topicBadge';
import { twMerge } from 'tailwind-merge';

export const BlogTopics = ({
  topics,
  className,
}: {
  topics: string[];
  className?: string;
}) => {
  return (
    <div className={twMerge(className, 'flex items-center gap-1 flex-wrap')}>
      {topics.length ? (
        topics?.map((topic, index) => (
          <TopicBadgeBlog key={index} topic={topic} />
        ))
      ) : (
        <span className='font-roboto text-xs md:text-sm opacity-80'>
          No topics available
        </span>
      )}
    </div>
  );
};
