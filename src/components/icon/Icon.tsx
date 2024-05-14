// Remix Icons: https://remixicon.com/
// Github: https://github.com/Remix-Design/RemixIcon
import * as RemixIcons from '@remixicon/react';

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
  | 'RiFileCopyLine'
  | 'RiCircleFill'
  | 'RiSettings3Line'
  | 'RiHistoryLine'
  | 'RiMailFill'
  | 'RiShareLine'
  | 'RiEditLine'
  | 'RiEyeLine'
  | 'RiCalendar2Line'
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
  className?: string;
};

const Icon: React.FC<IconProps> = ({ name, size = 20, className }) => {
  const DynamicIcon = RemixIcons[name];

  return <DynamicIcon className={className} size={size} />;
};

export default Icon;
