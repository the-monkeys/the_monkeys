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
  showText = true,
  size = 20,
}: {
  isVerified?: boolean;
  className?: string;
  showText?: boolean;
  size?: number;
}) => {
  if (isVerified !== true) return null;

  if (!showText) {
    return (
      <RiVerifiedBadgeFill
        size={size}
        className={twMerge('text-brand-orange shrink-0', className)}
        aria-hidden
        title='Verified account'
      />
    );
  }

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
