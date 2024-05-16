import { FC } from 'react';

type GridTagProps = {
  title: string;
};

const GridTag: FC<GridTagProps> = ({ title }) => {
  return (
    <div className='w-fit px-2 pt-1 flex items-center justify-center border-1 border-primary-monkeyOrange rounded-full'>
      <p className='font-josefin_Sans uppercase text-xs'>{title}</p>
    </div>
  );
};

export default GridTag;
