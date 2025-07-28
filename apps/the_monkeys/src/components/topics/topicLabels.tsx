import Link from 'next/link';

import { Badge } from '@the-monkeys/ui/atoms/badge';

import Icon from '../icon';

export const TopicLabelLink = ({ topic }: { topic: string }) => {
  return (
    <Link href={`/topics/${topic}`} className='group' target='_blank'>
      <Badge variant='outline' className='px-4 py-[6px] cursor-pointer'>
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
