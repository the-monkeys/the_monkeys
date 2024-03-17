import { twMerge } from 'tailwind-merge';

import { iconVariantStyles } from '../variantStyles';
import Icon, { IconName } from './Icon';

export type IconVariants =
  | 'base'
  | 'primary'
  | 'secondary'
  | 'alert'
  | 'ghost'
  | 'shallow'
  | 'orange'
  | 'white';

export type IconVariantStyles = {
  base: string;
  primary: string;
  secondary: string;
  alert: string;
  shallow: string;
  ghost: string;
  orange: string;
  white: string;
};

export type IconContainerProps = {
  name: IconName;
  size?: number;
  hasHover?: boolean;
  toolTip?: boolean;
  toolTipSide?: 'top' | 'right' | 'bottom' | 'left';
  variant?: IconVariants;
  className?: string;
  onClick?: () => void;
};

const IconContainer: React.FC<IconContainerProps> = ({
  name,
  size = 24,
  hasHover = true,
  variant,
  className,
  onClick,
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'base':
        return `${iconVariantStyles['base']}`;
      case 'primary':
        return `${iconVariantStyles['primary']}`;
      case 'secondary':
        return `${iconVariantStyles['secondary']}`;
      case 'alert':
        return `${iconVariantStyles['alert']}`;
      case 'ghost':
        return `${iconVariantStyles['ghost']}`;
      case 'shallow':
        return `${iconVariantStyles['shallow']}`;
      case 'orange':
        return `${iconVariantStyles['orange']}`;
      case 'white':
        return `${iconVariantStyles['white']}`;
    }
  };

  return (
    <div
      onClick={onClick}
      className={twMerge(className, 'flex justify-center items-center')}
    >
      <Icon
        name={name}
        size={size}
        hasHover={hasHover}
        className={getStyles()}
      />
    </div>
  );
};

export default IconContainer;
