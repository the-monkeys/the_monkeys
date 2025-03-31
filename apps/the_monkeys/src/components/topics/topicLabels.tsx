import Link from 'next/link';

import { TOPICS_COLOR_CODE } from '@/constants/topics';

import Icon from '../icon';
import { Badge } from '../ui/badge';

export const TopicLabelLink = ({ topic }: { topic: string }) => {
  return (
    <Link href={`/topics/${topic}`} className='group' target='_blank'>
      <Badge variant='outline' className='px-4 py-1 cursor-pointer !rounded-md'>
        {topic}{' '}
        <Icon
          name='RiArrowRightUp'
          size={16}
          className='ml-1 opacity-50 group-hover:opacity-100'
        />
      </Badge>
    </Link>
  );
};

export const TopicLabelLinkHash = ({
  topic,
  colorCodeIndex,
}: {
  topic: string;
  colorCodeIndex: number;
}) => {
  return (
    <div className='flex items-center'>
      <div
        style={{
          color: TOPICS_COLOR_CODE[colorCodeIndex],
        }}
      >
        <Icon name='RiHashtag' type='NIL' size={18} />
      </div>

      <Link
        href={`/topics/${topic}`}
        className='opacity-80 hover:opacity-100'
        target='_blank'
      >
        <p className='text-sm whitespace-nowrap'>{topic}</p>
      </Link>
    </div>
  );
};
