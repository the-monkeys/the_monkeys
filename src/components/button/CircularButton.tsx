import { FC, InputHTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

import IconContainer from '../icon';
import { IconName } from '../icon/Icon';

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
        disabled && 'cursor-not-allowed'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <IconContainer
        name={iconName}
        size={18}
        variant='white'
        className={twMerge(!disabled && animate && 'group-hover:animate-shake')}
        hasHover={false}
      />
    </button>
  );
};

export default CircularButton;
