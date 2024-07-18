// Remix Icons: https://remixicon.com/
// Github: https://github.com/Remix-Design/RemixIcon
import * as RemixIcons from '@remixicon/react';

export type IconName =
  | 'RiSun'
  | 'RiMoon'
  | 'RiNotification3'
  | 'RiUser'
  | 'RiPencil'
  | 'RiSearch'
  | 'RiMapPin'
  | 'RiBookmark'
  | 'RiArrowRightUp'
  | 'RiArrowRight'
  | 'RiArrowLeft'
  | 'RiMore'
  | 'RiLoader5'
  | 'RiRadioButton'
  | 'RiClose'
  | 'RiAdd'
  | 'RiFileCopy'
  | 'RiUpload2'
  | 'RiDeleteBin'
  | 'RiCursor'
  | 'RiSettings3'
  | 'RiHistory'
  | 'RiShareForward'
  | 'RiEditBox'
  | 'RiCodeSSlash'
  | 'RiCalendar'
  | 'RiMail'
  | 'RiGithub'
  | 'RiTwitterX'
  | 'RiDiscord'
  | 'RiGoogle'
  | 'RiMeta'
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
