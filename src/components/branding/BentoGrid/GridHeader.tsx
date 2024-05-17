import { FC } from 'react';

import { twMerge } from 'tailwind-merge';

type GridHeaderProps = {
  title: string;
  subheading: string;
  className?: string;
};

const GridHeader: FC<GridHeaderProps> = ({ title, subheading, className }) => {
  return (
    <div className={twMerge(className, 'mt-4 flex flex-col')}>
      <p className='font-josefin_Sans text-xl sm:text-2xl text-primary-monkeyBlack dark:text-primary-monkeyWhite'>
        {title}
      </p>
      <p className='font-jost font-light text-sm sm:text-base text-secondary-darkGrey dark:text-secondary-white'>
        {subheading}
      </p>
    </div>
  );
};

export default GridHeader;
