import { FC } from 'react';

import { twMerge } from 'tailwind-merge';

import Icon from '../icon/icon';

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
        <div onClick={onRemove}>
          <Icon name='RiClose' size={16} className={iconStyles} />
        </div>
      )}
    </div>
  );
};

export default Chip;
