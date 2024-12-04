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
    <div className='w-full flex items-center border-1 border-border-light dark:border-border-dark p-4 rounded-md space-x-4 hover:bg-foreground-light dark:hover:bg-foreground-dark cursor-default'>
      <div>
        <Icon name={icon} type='Fill' size={24} />
      </div>

      <div className='flex-1'>
        <p className='font-dm_sans font-medium text-lg'>{title}</p>

        <p className='font-roboto text-sm md:text-base opacity-80'>{text}</p>
      </div>

      <div>
        <Link href={link}>
          <Icon name='RiArrowRightUp' className='text-brand-orange' />
        </Link>
      </div>
    </div>
  );
};

export default SocialCard;
