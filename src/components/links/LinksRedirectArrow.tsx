import { FC } from 'react';

import Link from 'next/link';

import { twMerge } from 'tailwind-merge';

import Icon from '../icon';

type LinksRedirectProps = {
  position?: 'Left' | 'Right';
  link: string;
  className?: string;
  children?: React.ReactNode;
};

const LinksRedirectArrow: FC<LinksRedirectProps> = ({
  position = 'Right',
  link,
  className,
  children,
}) => {
  return (
    <Link href={link} className={twMerge(className, 'group flex items-center')}>
      {position === 'Left' && (
        <Icon
          name='RiArrowLeft'
          size={16}
          className='mx-2 transition-all group-hover:ml-1 group-hover:mr-3 group-hover:text-primary-monkeyOrange'
        />
      )}

      {children}

      {position === 'Right' && (
        <Icon
          name='RiArrowRight'
          size={16}
          className='mx-2 transition-all group-hover:ml-3 group-hover:mr-1 group-hover:text-primary-monkeyOrange'
        />
      )}
    </Link>
  );
};

export default LinksRedirectArrow;
