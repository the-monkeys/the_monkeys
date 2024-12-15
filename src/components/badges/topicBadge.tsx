import Link from 'next/link';

import { Badge } from '../ui/badge';

export const TopicBadgeProfile = ({ topic }: { topic: string }) => {
  return (
    <Link href={`/feed?topic=${topic}`}>
      <Badge variant='outline' className='py-1 cursor-pointer'>
        {topic}
      </Badge>
    </Link>
  );
};

export const TopicBadgeBlog = ({ topic }: { topic: string }) => {
  return (
    <Link href={`/feed?topic=${topic}`}>
      <Badge variant='outline' className='cursor-pointer'>
        {topic}
      </Badge>
    </Link>
  );
};
