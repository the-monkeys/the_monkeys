import { FC } from 'react';

import { twMerge } from 'tailwind-merge';

type GridTagProps = {
  title: string;
  className?: string;
};

const GridTag: FC<GridTagProps> = ({ title, className }) => {
  return (
    <div
      className={twMerge(
        className,
        'w-fit px-3 flex items-center justify-center bg-primary-monkeyOrange text-secondary-white rounded-full'
      )}
    >
      <p className='font-jost uppercase text-xs sm:text-sm'>{title}</p>
    </div>
  );
};

export default GridTag;
