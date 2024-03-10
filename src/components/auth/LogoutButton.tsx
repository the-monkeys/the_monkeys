import { FC } from 'react';

import { twMerge } from 'tailwind-merge';

import Icon from '../icon';

type LogoutButtonProps = {
  className?: string;
  onlyIcon?: boolean;
};

const LogoutButton: FC<LogoutButtonProps> = ({ className, onlyIcon }) => {
  return (
    <div
      className={twMerge(
        className,
        'flex cursor-pointer gap-2 text-alert-red hover:opacity-75'
      )}
    >
      <Icon name='RiLogoutCircleRLine' />
      {!onlyIcon && <p className='font-josefin_Sans'>Log out</p>}
    </div>
  );
};

export default LogoutButton;
