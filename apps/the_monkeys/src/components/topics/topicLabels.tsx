import Link from 'next/link';

import { createTopicUrl } from '@/utils/topicUtils';
import { Badge } from '@the-monkeys/ui/atoms/badge';

import Icon from '../icon';

export const TopicLabelLink = ({ topic }: { topic: string }) => {
  return (
    <Link href={createTopicUrl(topic)} className='group' target='_blank'>
      <Badge variant='secondary' className='px-4 py-[6px] cursor-pointer'>
        {topic}{' '}
        <Icon
          name='RiArrowRightUp'
          size={16}
          className='ml-1 opacity-80 group-hover:opacity-100'
        />
      </Badge>
    </Link>
  );
};

export const TopicLabelLinkProfile = ({ topic }: { topic: string }) => {
  return (
    <Link href={createTopicUrl(topic)} className='group' target='_blank'>
      <Badge variant='outline' className='px-3 py-1 cursor-pointer'>
        {topic}
      </Badge>
    </Link>
  );
};
