import { FC } from 'react';

import Link from 'next/link';

import { twMerge } from 'tailwind-merge';

type LinksRedirectProps = {
  target: string;
  title: string;
  className?: string;
};

const LinksRedirectUnderline: FC<LinksRedirectProps> = ({
  target,
  title,
  className,
}) => {
  return (
    <Link href={target} className={twMerge(className, 'group flex flex-col')}>
      <p className='font-jost text-secondary-lightGrey'>{title}</p>
      <span className='h-[1px] w-0 bg-secondary-lightGrey transition-all group-hover:w-full'></span>
    </Link>
  );
};

export default LinksRedirectUnderline;
