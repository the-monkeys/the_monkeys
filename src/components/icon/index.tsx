import { twMerge } from 'tailwind-merge';

import Icon, { IconName } from './Icon';

export type IconContainerProps = {
  name: IconName;
  size?: number;
  hasHover?: boolean;
  isPointer?: boolean;
  toolTip?: boolean;
  toolTipSide?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  onClick?: () => void;
};

const IconContainer: React.FC<IconContainerProps> = ({
  name,
  size = 24,
  hasHover = true,
  isPointer = true,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        className,
        'flex justify-center items-center',
        hasHover && 'hover:opacity-75',
        isPointer && 'cursor-pointer'
      )}
    >
      <Icon name={name} size={size} className={className} />
    </div>
  );
};

export default IconContainer;
