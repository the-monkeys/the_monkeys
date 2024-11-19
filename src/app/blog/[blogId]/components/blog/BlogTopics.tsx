import { Badge } from '@/components/ui/badge';
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
      <p className='pr-1 font-jost text-sm opacity-75'>Topics:</p>

      {topics.length &&
        topics?.map((topic) => (
          <Badge variant='secondary' key={topic} className='font-jost text-xs'>
            {topic}
          </Badge>
        ))}
    </div>
  );
};
