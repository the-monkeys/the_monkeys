import Link from 'next/link';

import { Badge } from '../ui/badge';

export const TopicBadgeProfile = ({ topic }: { topic: string }) => {
  return (
    <Badge variant='outline' className='text-sm py-1'>
      <Link href={`/home?topic=${topic}`}>{topic}</Link>
    </Badge>
  );
};

export const TopicBadgeBlog = ({ topic }: { topic: string }) => {
  return (
    <Badge variant='secondary' className='text-sm py-1'>
      <Link href={`/home?topic=${topic}`}>{topic}</Link>
    </Badge>
  );
};
