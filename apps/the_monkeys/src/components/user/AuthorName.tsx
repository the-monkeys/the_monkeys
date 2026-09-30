import { twMerge } from 'tailwind-merge';

import { VerifiedBadge } from './VerifiedBadge';

export const AuthorName = ({
  firstName,
  lastName,
  isVerified,
  className,
  size = 14,
}: {
  firstName?: string;
  lastName?: string;
  isVerified?: boolean;
  className?: string;
  size?: number;
}) => {
  const name = [firstName, lastName].filter(Boolean).join(' ');

  return (
    <span
      className={twMerge(
        'inline-flex min-w-0 max-w-full items-center gap-1',
        className
      )}
    >
      <span className='min-w-0 truncate group-hover/author:underline'>
        {name}
      </span>
      <VerifiedBadge
        isVerified={isVerified === true}
        showText={false}
        size={size}
      />
    </span>
  );
};
