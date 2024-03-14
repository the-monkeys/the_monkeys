import { FC } from 'react';

import Link from 'next/link';

import { twMerge } from 'tailwind-merge';

import Icon from '../icon';
import IconContainer from '../icon';

type LinksRedirectProps = {
  target: string;
  title: string;
  className?: string;
};

const LinksRedirectArrow: FC<LinksRedirectProps> = ({
  target,
  title,
  className,
}) => {
  return (
    <Link
      href={target}
      className={twMerge(className, 'group flex items-center')}
    >
      <p className='font-josefin_Sans'>{title}</p>

      <IconContainer
        name='RiArrowRightLine'
        size={16}
        className='mx-2 transition-all group-hover:ml-3 group-hover:mr-1'
      />
    </Link>
  );
};

export default LinksRedirectArrow;
