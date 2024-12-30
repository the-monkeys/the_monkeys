import Link from 'next/link';

import { Badge } from '../ui/badge';

export const TopicBadgeProfile = ({ topic }: { topic: string }) => {
  return (
    <Link href={`/topics/${topic}`}>
      <Badge variant='secondary' className='py-1 cursor-pointer rounded-md'>
        {topic}
      </Badge>
    </Link>
  );
};

export const TopicBadgeBlog = ({ topic }: { topic: string }) => {
  return (
    <Link href={`/topics/${topic}`}>
      <Badge variant='secondary' className='px-4 py-1 cursor-pointer'>
        {topic}
      </Badge>
    </Link>
  );
};
