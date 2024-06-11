import { ButtonHTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

import Icon, { IconName } from '../icon/icon';
import { buttonVariantStyles } from '../variantStyles';

type ButtonVariants = 'primary' | 'secondary' | 'alert' | 'ghost' | 'shallow';

export type ButtonVariantStyles = {
  base: string;
  primary: string;
  secondary: string;
  alert: string;
  shallow: string;
  ghost: string;
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  variant: ButtonVariants;
  startIcon?: boolean;
  endIcon?: boolean;
  iconName?: IconName;
  toolTip?: boolean;
  toolTipSide?: 'top' | 'right' | 'bottom' | 'left';
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant,
  startIcon,
  endIcon,
  iconName,
  onClick,
  disabled,
  className,
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return `${buttonVariantStyles['base']} ${buttonVariantStyles['primary']}`;
      case 'secondary':
        return `${buttonVariantStyles['base']} ${buttonVariantStyles['secondary']}`;
      case 'alert':
        return `${buttonVariantStyles['base']} ${buttonVariantStyles['alert']}`;
      case 'ghost':
        return `${buttonVariantStyles['base']} ${buttonVariantStyles['ghost']}`;
      case 'shallow':
        return `${buttonVariantStyles['base']} ${buttonVariantStyles['shallow']}`;
    }
  };

  return (
    <button
      className={twMerge(
        className,
        'flex items-center gap-4 justify-center',
        getStyles(),
        disabled && 'cursor-not-allowed'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon || endIcon ? (
        <>
          <Icon
            name={iconName || 'RiUser'}
            className={startIcon ? 'opacity-100' : 'opacity-0'}
          />
          <p className='flex-1'>{title}</p>
          <Icon
            name={iconName || 'RiUser'}
            className={endIcon ? 'opacity-100' : 'opacity-0'}
          />
        </>
      ) : (
        <p>{title}</p>
      )}
    </button>
  );
};

export default Button;
