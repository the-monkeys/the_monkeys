// Remix Icons: https://remixicon.com/
// Github: https://github.com/Remix-Design/RemixIcon
import * as RemixIcons from '@remixicon/react';
import { twMerge } from 'tailwind-merge';

export type IconName =
  | 'RiToggleLine'
  | 'RiToggleFill'
  | 'RiNotification3Line'
  | 'RiNotification3Fill'
  | 'RiUserLine'
  | 'RiUserFill'
  | 'RiPencilLine'
  | 'RiSearchLine'
  | 'RiBookmarkLine'
  | 'RiDraftLine'
  | 'RiArrowRightUpLine'
  | 'RiArrowRightLine'
  | 'RiMoreLine'
  | 'RiCloseLine'
  | 'RiAddLine'
  | 'RiCircleFill'
  | 'RiSettings3Line'
  | 'RiHistoryLine'
  | 'RiMailFill'
  | 'RiShareLine'
  | 'RiEditLine'
  | 'RiEyeLine'
  | 'RiCalendarLine'
  | 'RiGithubFill'
  | 'RiTwitterXFill'
  | 'RiDiscordFill'
  | 'RiGoogleFill'
  | 'RiInstagramFill'
  | 'RiAlertLine'
  | 'RiCheckLine'
  | 'RiErrorWarningFill'
  | 'RiErrorWarningLine'
  | 'RiLoginBoxLine'
  | 'RiLogoutBoxRLine';

export type IconProps = {
  name: IconName;
  size?: number;
  hasHover?: boolean;
  className?: string;
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  hasHover = true,
  className,
}) => {
  const DynamicIcon = RemixIcons[name];

  return (
    <DynamicIcon
      className={twMerge(
        className,
        'cursor-pointer',
        hasHover && 'hover:opacity-75'
      )}
      size={size}
    />
  );
};

export default Icon;
