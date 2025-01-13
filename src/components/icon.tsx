// Remix Icons: https://remixicon.com/
// Github: https://github.com/Remix-Design/RemixIcon
import * as RemixIcons from '@remixicon/react';

export type IconName =
  | 'RiSun'
  | 'RiMoon'
  | 'RiNotification3'
  | 'RiUser'
  | 'RiGroup'
  | 'RiUserFollow'
  | 'RiUserUnfollow'
  | 'RiPencil'
  | 'RiSearch'
  | 'RiMapPinUser'
  | 'RiLinks'
  | 'RiBookmark'
  | 'RiIndeterminateCircle'
  | 'RiChat1'
  | 'RiArrowRightUp'
  | 'RiArrowRight'
  | 'RiArrowLeft'
  | 'RiArrowDownS'
  | 'RiArrowUpS'
  | 'RiMore'
  | 'RiLoader5'
  | 'RiRadioButton'
  | 'RiClose'
  | 'RiCompass'
  | 'RiNewspaper'
  | 'RiSparkling'
  | 'RiAdd'
  | 'RiSubtract'
  | 'RiClipboard'
  | 'RiUpload2'
  | 'RiDeleteBin6'
  | 'RiNavigation'
  | 'RiSettings3'
  | 'RiHistory'
  | 'RiShareForward'
  | 'RiEdit2'
  | 'RiHeart3'
  | 'RiCalendar'
  | 'RiMail'
  | 'RiMailOpen'
  | 'RiCodeSSlash'
  | 'RiShakeHands'
  | 'RiGithub'
  | 'RiTwitterX'
  | 'RiDiscord'
  | 'RiGoogle'
  | 'RiMeta'
  | 'RiWhatsapp'
  | 'RiInstagram'
  | 'RiLinkedin'
  | 'RiCheck'
  | 'RiLoginBox'
  | 'RiLogoutBoxR'
  | 'RiErrorWarning'
  | 'RiVerifiedBadge'
  | 'RiEye'
  | 'RiEyeClose';

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
