import Link from 'next/link';

import { TOPICS_COLOR_CODE } from '@/constants/topics';

import Icon from '../icon';
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
    <Link href={`/topics/${topic}`} className='group'>
      <Badge variant='secondary' className='px-4 py-1 cursor-pointer'>
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

export const TopicBadgeShowcase = ({
  topic,
  colorCodeIndex,
}: {
  topic: string;
  colorCodeIndex: number;
}) => {
  return (
    <div className='flex items-center gap-1'>
      <div
        style={{
          color: TOPICS_COLOR_CODE[colorCodeIndex],
        }}
      >
        <Icon name='RiHashtag' type='NIL' size={16} />
      </div>

      <Link href={`/topics/${topic}`} className='opacity-80 hover:opacity-100'>
        <p className='text-sm whitespace-nowrap'>{topic}</p>
      </Link>
    </div>
  );
};

export const TopicBadgeShowcaseDefault = () => {
  return (
    <div className='flex items-center gap-1'>
      <div
        style={{
          color: '#696969',
        }}
      >
        <Icon name='RiPriceTag3' type='Fill' size={16} />
      </div>

      <p className='text-sm opacity-80 whitespace-nowrap'>
        no topics available
      </p>
    </div>
  );
};
