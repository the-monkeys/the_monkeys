import { TopicBadgeBlog } from '@/components/badges/topicBadge';
import { twMerge } from 'tailwind-merge';

export const BlogTopics = ({
  topics,
  className,
}: {
  topics: string[];
  className?: string;
}) => {
  if (!topics.length) return null;

  return (
    <div className={twMerge(className, 'flex items-center gap-1 flex-wrap')}>
      {topics?.map((topic, index) => (
        <TopicBadgeBlog key={index} topic={topic} />
      ))}
    </div>
  );
};
