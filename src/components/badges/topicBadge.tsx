import Link from 'next/link';

import { Badge } from '../ui/badge';

export const TopicBadgeProfile = ({ topic }: { topic: string }) => {
  return (
    <Badge variant='outline' className='py-1'>
      <Link href={`/feed?topic=${topic}`}>{topic}</Link>
    </Badge>
  );
};

export const TopicBadgeBlog = ({ topic }: { topic: string }) => {
  return (
    <Badge variant='secondary'>
      <Link href={`/feed?topic=${topic}`}>{topic}</Link>
    </Badge>
  );
};
