import { FC } from 'react';

import { twMerge } from 'tailwind-merge';

type GridHeaderProps = {
  title: string;
  subheading: string;
  className?: string;
};

const GridHeader: FC<GridHeaderProps> = ({ title, subheading, className }) => {
  return (
    <div className={twMerge(className, 'flex flex-col')}>
      <p className='font-playfair_Display font-semibold text-2xl sm:text-3xl text-primary-monkeyBlack dark:text-primary-monkeyWhite'>
        {title}
      </p>

      <p className='mt-2 font-jost font-light text-base sm:text-lg text-secondary-darkGrey dark:text-secondary-white'>
        {subheading}
      </p>
    </div>
  );
};

export default GridHeader;
