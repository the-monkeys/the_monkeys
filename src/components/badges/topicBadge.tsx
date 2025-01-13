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

export const TopicBadgeShowcase = ({
  topic,
  colorCode,
}: {
  topic: string;
  colorCode: string;
}) => {
  return (
    <Link
      href={`/topics/${topic}`}
      style={{
        backgroundColor: colorCode + '25',
        borderColor: colorCode,
      }}
      className='px-2 py-[1px] border-1 rounded-full hover:opacity-80'
    >
      <p
        style={{
          color: colorCode,
        }}
        className='font-dm_sans text-xs whitespace-nowrap'
      >
        {topic}
      </p>
    </Link>
  );
};
