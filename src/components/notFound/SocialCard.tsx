import { FC } from 'react';
import Icon, { IconName } from '../icon';
import Link from 'next/link';

export type SocialCardProps = {
  icon: IconName;
  title: string;
  text: string;
  link: string;
};

const SocialCard: FC<SocialCardProps> = ({ icon, title, text, link }) => {
  return (
    <div className='group flex w-full items-center justify-between border-1 border-secondary-lightGrey/25 p-4 hover:border-primary-monkeyOrange'>
      <div className='flex gap-5'>
        <Icon name={icon} size={28} hasHover={false} />
        <div className='flex flex-col justify-center'>
          <p className='flex items-start font-josefin_Sans text-lg md:text-xl'>
            {title}
          </p>
          <p className='font-jost text-sm text-secondary-lightGrey md:text-base'>
            {text}
          </p>
        </div>
      </div>
      <Link
        className='opacity-0 group-hover:opacity-100'
        href={link}
        target='_blank'
      >
        <Icon
          name='RiArrowRightUpLine'
          variant='orange'
          size={24}
          hasHover={false}
        />
      </Link>
    </div>
  );
};

export default SocialCard;
