// Remix Icons: https://remixicon.com/
// Github: https://github.com/Remix-Design/RemixIcon
import * as RemixIcons from '@remixicon/react';

export type IconName =
  | 'RiToggle'
  | 'RiSun'
  | 'RiMoon'
  | 'RiNotification3'
  | 'RiUser'
  | 'RiShakeHands'
  | 'RiTeam'
  | 'RiArchiveStack'
  | 'RiCompass3'
  | 'RiPencil'
  | 'RiSearch'
  | 'RiBookmark'
  | 'RiDraft'
  | 'RiArrowRightUp'
  | 'RiArrowRight'
  | 'RiMore'
  | 'RiClose'
  | 'RiAdd'
  | 'RiFileCopy'
  | 'RiSettings3'
  | 'RiHistory'
  | 'RiShare'
  | 'RiEdit'
  | 'RiCalendar2'
  | 'RiMail'
  | 'RiGithub'
  | 'RiTwitterX'
  | 'RiDiscord'
  | 'RiGoogle'
  | 'RiInstagram'
  | 'RiCheck'
  | 'RiLoginBox'
  | 'RiLogoutBoxR';

export type IconProps = {
  name: IconName;
  type?: 'Fill' | 'Line';
  size?: number;
  className?: string;
};

const Icon: React.FC<IconProps> = ({
  name,
  type = 'Line',
  size = 20,
  className,
}) => {
  const iconName = `${name}${type}`;

  const DynamicIcon = RemixIcons[iconName as keyof typeof RemixIcons];

  if (!DynamicIcon) {
    console.error(`Icon "${iconName}" does not exist in RemixIcons.`);
    return null;
  }

  return <DynamicIcon className={className} size={size} />;
};

export default Icon;
