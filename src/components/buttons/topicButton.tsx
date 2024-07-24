import { twMerge } from 'tailwind-merge';

import { Button } from '../ui/button';

const TopicButton = ({
  letter,
  onClick,
}: {
  letter: string;
  onClick: () => void;
}) => {
  return (
    <Button
      variant='ghost'
      onClick={onClick}
      className='size-8 sm:size-10 rounded-full'
    >
      <p className='font-jost text-sm sm:text-base font-medium'>{letter}</p>
    </Button>
  );
};

export default TopicButton;
