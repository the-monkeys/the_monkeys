import { RiVerifiedBadgeFill } from '@remixicon/react';
import { Badge } from '@the-monkeys/ui/atoms/badge';
import { twMerge } from 'tailwind-merge';

/**
 * Blue-check badge. Renders only when callers pass `isVerified === true`
 * (optional fields on stale profiles change nothing). Reusable across
 * profile header, comments and search results.
 */
export const VerifiedBadge = ({
  isVerified,
  className,
}: {
  isVerified?: boolean;
  className?: string;
}) => {
  if (isVerified !== true) return null;

  return (
    <Badge
      variant='brand'
      title='Verified account'
      aria-label='Verified account'
      className={twMerge('!gap-[2px] !px-1.5 !py-0 text-xs', className)}
    >
      <RiVerifiedBadgeFill size={12} aria-hidden />
      <span className='hidden sm:inline'>Verified</span>
    </Badge>
  );
};
