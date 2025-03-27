import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';

import Icon from '../icon';

export const ShareButton = ({
  type,
  url,
}: {
  type: 'X' | 'LinkedIn' | 'WhatsApp' | 'Facebook';
  url: string;
}): React.ReactElement | null => {
  const buttonType = type;
  const buttonStyles = 'rounded-xl overflow-hidden hover:opacity-80';

  switch (buttonType) {
    case 'X':
      return (
        <TwitterShareButton url={url} className={buttonStyles}>
          <div className='size-12 flex justify-center items-center bg-[#000000]'>
            <Icon
              name='RiTwitterX'
              size={24}
              type='Fill'
              className='text-text-dark'
            />
          </div>
        </TwitterShareButton>
      );

    case 'Facebook':
      return (
        <FacebookShareButton url={url} className={buttonStyles}>
          <div className='size-12 flex justify-center items-center bg-[#1877F2]'>
            <Icon
              name='RiMeta'
              size={24}
              type='Fill'
              className='text-text-dark'
            />
          </div>
        </FacebookShareButton>
      );

    case 'LinkedIn':
      return (
        <LinkedinShareButton url={url} className={buttonStyles}>
          <div className='size-12 flex justify-center items-center bg-[#0a66c2]'>
            <Icon
              name='RiLinkedin'
              size={24}
              type='Fill'
              className='text-text-dark'
            />
          </div>
        </LinkedinShareButton>
      );

    case 'WhatsApp':
      return (
        <WhatsappShareButton url={url} className={buttonStyles}>
          <div className='size-12 flex justify-center items-center bg-[#25D366]'>
            <Icon name='RiWhatsapp' size={24} className='text-text-dark' />
          </div>
        </WhatsappShareButton>
      );

    default:
      return null;
  }
};

export const ShareButtonContainer = ({
  children,
  label,
}: {
  children: React.ReactElement;
  label: string;
}) => {
  return (
    <div className='p-2 flex flex-col items-center gap-2'>
      {children}

      <p className='font-dm_sans text-xs'>{label}</p>
    </div>
  );
};
