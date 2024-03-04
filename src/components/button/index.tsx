import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import Icon, { IconName } from '../icon';
import { buttonVariantStyles } from '../variantStyles';
import CircularButton from './CircularButton';

type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'alert'
  | 'ghost'
  | 'shallow'
  | 'circular';

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
  // Left aligned icon
  startIcon?: boolean;
  // Right aligned icon
  endIcon?: boolean;
  iconName?: IconName;
  animateIcon?: boolean;
  toolTip?: boolean;
  toolTipSide?: 'top' | 'right' | 'bottom' | 'left';
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant,
  startIcon,
  endIcon,
  iconName = 'RiErrorWarningLine',
  animateIcon,
  toolTip,
  toolTipSide,
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

  if (variant === 'circular') {
    return (
      <CircularButton
        animate={animateIcon}
        iconName={iconName}
        onClick={onClick}
        disabled={disabled}
        className={className}
      />
    );
  }

  return (
    <button
      className={twMerge(
        className,
        getStyles(),
        disabled && 'cursor-not-allowed opacity-75'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div className='flex items-center justify-center gap-4'>
        {startIcon && (
          <Icon name={iconName} size={20} hasHover={false} variant={variant} />
        )}
        <p>{title}</p>
        {endIcon && (
          <Icon name={iconName} size={20} hasHover={false} variant={variant} />
        )}
      </div>
    </button>
  );
};

export default Button;
