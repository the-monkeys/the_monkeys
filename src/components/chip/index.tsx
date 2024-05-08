import { FC } from 'react';

import { twMerge } from 'tailwind-merge';

import IconContainer from '../icon';

type ChipProps = {
  label: string;
  hasHover: boolean;
  clickable?: boolean;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
  iconStyles?: string;
  className?: string;
};

const Chip: FC<ChipProps> = ({
  label,
  hasHover,
  clickable,
  onClick,
  removable,
  onRemove,
  iconStyles,
  className,
}) => {
  return (
    <div
      className={twMerge(
        className,
        hasHover && 'hover:opacity-74',
        clickable && 'cursor-pointer',
        'group flex items-center gap-4'
      )}
      onClick={onClick}
    >
      <p className='font-jost cursor-default'>{label}</p>

      {removable && (
        <IconContainer
          name='RiCloseLine'
          size={16}
          onClick={onRemove}
          className={iconStyles}
        />
      )}
    </div>
  );
};

export default Chip;
