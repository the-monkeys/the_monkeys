import { Button } from '@the-monkeys/ui/atoms/button';

import Icon from '../icon';

export const PaginationPrevButton = ({
  onClick,
  disable,
}: {
  onClick: () => void;
  disable: boolean;
}) => {
  return (
    <Button
      variant='secondary'
      className='group flex items-center gap-1 rounded-full'
      onClick={onClick}
      disabled={disable}
    >
      <Icon name='RiArrowUpS' className='-rotate-90' />

      <p className='mr-2 text-sm'>Prev</p>
    </Button>
  );
};

export const PaginationNextButton = ({
  onClick,
  disable,
}: {
  onClick: () => void;
  disable: boolean;
}) => {
  return (
    <Button
      variant='secondary'
      className='group flex items-center gap-1 rounded-full'
      onClick={onClick}
      disabled={disable}
    >
      <p className='ml-2 text-sm'>Next</p>

      <Icon name='RiArrowUpS' className='rotate-90' />
    </Button>
  );
};
