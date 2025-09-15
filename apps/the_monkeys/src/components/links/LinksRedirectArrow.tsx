import { FC } from 'react';

import Link from 'next/link';

import { twMerge } from 'tailwind-merge';

import Icon from '../icon';

type LinksRedirectProps = {
  position?: 'Left' | 'Right';
  link: string;
  target?: '_blank' | '_self';
  className?: string;
  children?: React.ReactNode;
};

const LinksRedirectArrow: FC<LinksRedirectProps> = ({
  position = 'Right',
  link,
  target = '_self',
  className,
  children,
}) => {
  return (
    <Link
      target={target}
      href={link}
      className={twMerge(className, 'group flex items-center')}
    >
      {position === 'Left' && (
        <Icon
          name='RiArrowLeft'
          size={16}
          className='mx-2 transition-all group-hover:ml-1 group-hover:mr-3 opacity-80'
        />
      )}

      {children}

      {position === 'Right' && (
        <Icon
          name='RiArrowRight'
          size={16}
          className='mx-2 transition-all group-hover:ml-3 group-hover:mr-1 text-brand-orange group-hover:opacity-80'
        />
      )}
    </Link>
  );
};

export default LinksRedirectArrow;
