// Remix Icons: https://remixicon.com/
// Github: https://github.com/Remix-Design/RemixIcon

import * as RemixIcons from '@remixicon/react';
import { twMerge } from 'tailwind-merge';

export type IconName =
  | 'RiMenuLine'
  | 'RiMenu3Line'
  | 'RiToggleLine'
  | 'RiToggleFill'
  | 'RiNotification3Line'
  | 'RiUser3Line'
  | 'RiPencilLine'
  | 'RiSearchLine'
  | 'RiBookmarkLine'
  | 'RiArrowRightUpLine'
  | 'RiMoreLine'
  | 'RiCloseLine'
  | 'RiAddLine'
  | 'RiMailFill'
  | 'RiShareForwardFill'
  | 'RiShareForwardLine'
  | 'RiEyeLine'
  | 'RiEyeFill'
  | 'RiCake2Fill'
  | 'RiGithubFill'
  | 'RiTwitterXFill'
  | 'RiDiscordFill'
  | 'RiGoogleFill'
  | 'RiAlertLine'
  | 'RiErrorWarningLine';

export type IconProps = {
  name: IconName;
  size?: number;
  hasHover?: boolean;
  customColor?: boolean;
  color?: string;
  toolTip?: boolean;
  toolTipSide?: 'top' | 'right' | 'bottom' | 'left';
  onClick?: () => void;
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  hasHover = true,
  customColor,
  color,
  toolTip,
  toolTipSide,
  onClick,
}) => {
  const DynamicIcon = RemixIcons[name];

  return (
    <div className='flex items-center justify-center'>
      {customColor ? (
        <DynamicIcon
          className={twMerge(hasHover && 'hover:opacity-75')}
          size={size}
          onClick={onClick}
          color={color}
        />
      ) : (
        <DynamicIcon
          className={twMerge(
            'cursor-pointer text-primary-monkeyBlack dark:text-primary-monkeyWhite',
            hasHover && 'hover:opacity-75'
          )}
          size={size}
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default Icon;
