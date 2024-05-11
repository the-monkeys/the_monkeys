import { FC } from 'react';

import Link from 'next/link';

import Icon from '../icon';
import IconContainer from '../icon';
import { IconName } from '../icon/Icon';

export type SocialCardProps = {
  icon: IconName;
  title: string;
  text: string;
  link: string;
};

const SocialCard: FC<SocialCardProps> = ({ icon, title, text, link }) => {
  return (
    <Link
      href={link}
      target='_blank'
      className='group flex w-full items-center justify-between gap-2 border-1 border-secondary-lightGrey/25 p-4 hover:border-primary-monkeyOrange'
    >
      <div className='flex gap-5'>
        <Icon
          name={icon}
          size={28}
          hasHover={false}
          className='group-hover:text-primary-monkeyOrange'
        />
        <div className='flex flex-col justify-center'>
          <p className='flex items-start font-josefin_Sans text-lg md:text-xl'>
            {title}
          </p>
          <p className='font-jost text-sm text-secondary-lightGrey md:text-base'>
            {text}
          </p>
        </div>
      </div>

      <IconContainer
        name='RiArrowRightUpLine'
        variant='orange'
        size={24}
        hasHover={false}
        className='opacity-0 group-hover:opacity-100'
      />
    </Link>
  );
};

export default SocialCard;
