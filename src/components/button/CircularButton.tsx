import { FC, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import Icon, { IconName } from '../icon';

interface CircularButtonProps extends InputHTMLAttributes<HTMLButtonElement> {
  iconName?: IconName;
  animate?: boolean;
}

const CircularButton: FC<CircularButtonProps> = ({
  iconName = 'RiErrorWarningLine',
  animate,
  disabled,
  className,
  onClick,
}) => {
  return (
    <button
      className={twMerge(
        'cur group flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary-monkeyOrange transition-all',
        className,
        disabled && 'cursor-not-allowed opacity-75'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div
        className={twMerge(!disabled && animate && 'group-hover:animate-shake')}
      >
        <Icon name={iconName} size={18} variant='primary' hasHover={false} />
      </div>
    </button>
  );
};

export default CircularButton;
