import { FC } from 'react';

import { BlogTopic } from '@/constants/topics';

import Chip from '.';

type TopicChipProps = {
  data: BlogTopic;
  onRemove: (topicId: number) => void;
};

const TopicChip: FC<TopicChipProps> = ({ data, onRemove }) => {
  return (
    <Chip
      label={data.data}
      hasHover={false}
      removable
      onRemove={() => onRemove(data.id)}
      //   className='px-4 py-2 rounded-2xl drop-shadow-lg bg-gradient-to-r from-primary-monkeyOrange/75 dark:to-primary-monkeyBlack to-primary-monkeyWhite'
      className='px-4 py-2 rounded-2xl drop-shadow-md bg-secondary-darkGrey dark:bg-secondary-white text-primary-monkeyWhite dark:text-primary-monkeyBlack hover:drop-shadow-none'
      iconStyles='opacity-25 group-hover:opacity-100'
    />
  );
};

export default TopicChip;
