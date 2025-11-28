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
  | 'RiBookmark2'
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
  | 'RiHashtag'
  | 'RiSubtract'
  | 'RiClipboard'
  | 'RiUpload2'
  | 'RiDownload2'
  | 'RiDeleteBin6'
  | 'RiNavigation'
  | 'RiSettings3'
  | 'RiHistory'
  | 'RiShare'
  | 'RiShareForward'
  | 'RiEdit2'
  | 'RiHeart3'
  | 'RiCalendar'
  | 'RiMail'
  | 'RiMailOpen'
  | 'RiCodeSSlash'
  | 'RiShakeHands'
  | 'RiCameraLens'
  | 'RiGithub'
  | 'RiTwitterX'
  | 'RiDiscord'
  | 'RiGoogle'
  | 'RiMeta'
  | 'RiWhatsapp'
  | 'RiYoutube'
  | 'RiInstagram'
  | 'RiTelegram2'
  | 'RiLinkedin'
  | 'RiInformation'
  | 'RiCheck'
  | 'RiCloseCircle'
  | 'RiResetRight'
  | 'RiLoginBox'
  | 'RiLogoutBoxR'
  | 'RiErrorWarning'
  | 'RiVerifiedBadge'
  | 'RiEye'
  | 'RiEyeClose'
  | 'RiLightbulb'
  | 'RiMessage3'
  | 'RiMessage'
  | 'RiBug';

export type IconProps = {
  name: IconName;
  type?: 'Fill' | 'Line' | 'NIL';
  size?: number;
  className?: string;
};

const Icon: React.FC<IconProps> = ({
  name,
  type = 'Line',
  size = 20,
  className,
}) => {
  const iconName = type !== 'NIL' ? `${name}${type}` : name;

  const DynamicIcon = RemixIcons[iconName as keyof typeof RemixIcons];

  if (!DynamicIcon) {
    console.error(`Icon "${iconName}" does not exist in RemixIcons.`);
    return null;
  }

  return <DynamicIcon className={className} size={size} />;
};

export default Icon;
