import { twMerge } from 'tailwind-merge';

import Icon from './icon';

export const Loader = ({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        className,
        'p-1 w-fit flex justify-center items-center'
      )}
    >
      <Icon name='RiLoader5' size={size} className='animate-loader-rotate' />
    </div>
  );
};
