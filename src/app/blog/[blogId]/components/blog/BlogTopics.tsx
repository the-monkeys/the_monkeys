import { Badge } from '@/components/ui/badge';
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
      <p className='pr-1 font-roboto text-xs md:text-sm opacity-75'>Topics:</p>

      {topics.length ? (
        topics?.map((topic) => (
          <Badge
            variant='secondary'
            key={topic}
            className='font-roboto text-xs'
          >
            {topic}
          </Badge>
        ))
      ) : (
        <span className='font-roboto text-xs md:text-sm opacity-75'>
          Not available
        </span>
      )}
    </div>
  );
};
