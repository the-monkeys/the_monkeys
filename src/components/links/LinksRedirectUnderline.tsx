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
    <Link
      href={target}
      target='_blank'
      className={twMerge(className, 'group flex flex-col')}
    >
      <p className='font-jost opacity-85 group-hover:opacity-100'>{title}</p>
      <span className='h-[1px] w-0 bg-primary-monkeyBlack/25 dark:bg-primary-monkeyWhite/25 transition-all group-hover:w-full'></span>
    </Link>
  );
};

export default LinksRedirectUnderline;
