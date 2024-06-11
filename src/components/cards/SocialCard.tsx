import { FC } from 'react';

import Link from 'next/link';

import Icon, { IconName } from '../icon/icon';

export type SocialCardProps = {
  icon: IconName;
  title: string;
  text: string;
  link: string;
};

const SocialCard: FC<SocialCardProps> = ({ icon, title, text, link }) => {
  return (
    <div className='w-full flex items-center border-1 border-secondary-lightGrey/25 p-4 rounded-lg space-x-4 hover:bg-secondary-lightGrey/15 cursor-default'>
      <div>
        <Icon name={icon} type='Fill' size={24} />
      </div>

      <div className='flex-1'>
        <p className='font-josefin_Sans text-semibold text-lg'>{title}</p>

        <p className='font-jost text-sm md:text-base opacity-75'>{text}</p>
      </div>

      <div>
        <Link href={link}>
          <Icon name='RiArrowRightUp' className='text-primary-monkeyOrange' />
        </Link>
      </div>
    </div>
  );
};

export default SocialCard;
