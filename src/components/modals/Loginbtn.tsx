import React, { FC, InputHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import Icon, { IconName } from '../icon';

interface LoginbtnProps extends InputHTMLAttributes<HTMLButtonElement> {
  iconName?: IconName;
  animate?: boolean;
  title?: string;
}

const Loginbtn: FC<LoginbtnProps> = ({
  iconName = 'RiGoogleFill',
  animate,
  disabled,
  className,
  onClick,
  title,
}) => {
  return (
    <button
      className={twMerge(
        'flex h-10 w-full max-w-96 items-center rounded-lg border md:min-w-0 ',
        className,
        disabled && 'cursor-not-allowed opacity-75'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div
        className={twMerge(
          'ml-6',
          !disabled && animate && 'group-hover:animate-shake'
        )}
      >
        <Icon
          name={iconName}
          size={18}
          customColor={true}
          hasHover={false}
          className=''
        />
      </div>
      {title && <p className='ml-20 text-center'>{title}</p>}
    </button>
  );
};

export default Loginbtn;
