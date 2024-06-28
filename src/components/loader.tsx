import { twMerge } from 'tailwind-merge';

import Icon from './icon';

export const Loader1 = ({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <div className={twMerge(className, 'p-2')}>
      <Icon name='RiLoader4' size={size} className='animate-rotate' />
    </div>
  );
};

export const Loader2 = ({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <div className={twMerge(className, 'p-2')}>
      <Icon name='RiLoader' size={size} className='animate-rotate' />
    </div>
  );
};
