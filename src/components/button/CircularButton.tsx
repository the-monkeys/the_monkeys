import { FC, InputHTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

import Icon, { IconName } from '../icon/Icon';

interface CircularButtonProps extends InputHTMLAttributes<HTMLButtonElement> {
  iconName: IconName;
}

const CircularButton: FC<CircularButtonProps> = ({
  iconName,
  disabled,
  className,
  onClick,
}) => {
  return (
    <button
      className={twMerge(
        'group flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary-monkeyBlack text-secondary-white dark:bg-primary-monkeyWhite dark:text-secondary-darkGrey hover:opacity-75',
        className,
        disabled && 'cursor-not-allowed'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon name={iconName} size={18} />
    </button>
  );
};

export default CircularButton;
