import Link from 'next/link';

import Icon, { IconName } from '../icon';

const SocialCard = ({
  icon,
  title,
  text,
  link,
}: {
  icon: IconName;
  title: string;
  text: string;
  link: string;
}) => {
  return (
    <div className='group w-full flex items-center border-1 border-border-light dark:border-border-dark p-4 rounded-md space-x-4 cursor-default'>
      <div>
        <Icon name={icon} type='Fill' size={24} />
      </div>

      <div className='flex-1'>
        <p className='font-dm_sans font-medium text-lg'>{title}</p>

        <p className='font-roboto font-light text-xs md:text-sm'>{text}</p>
      </div>

      <Link href={link}>
        <Icon name='RiArrowRightUp' className='group-hover:text-brand-orange' />
      </Link>
    </div>
  );
};

export default SocialCard;
