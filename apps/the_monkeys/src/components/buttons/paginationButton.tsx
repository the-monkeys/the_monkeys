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
      <Icon
        name='RiArrowUpS'
        className='-rotate-90 mr-[1px] ml-[2px] group-hover:mr-[2px] group-hover:ml-[1px] transition-transform'
      />
      <p className='mr-2'>Prev</p>
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
      <p className='ml-2'>Next</p>
      <Icon
        name='RiArrowUpS'
        className='rotate-90 ml-[1px] mr-[2px] group-hover:ml-[2px] group-hover:mr-[1px] transition-transform'
      />
    </Button>
  );
};
