import * as React from 'react';

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-[2px] text-xs sm:text-sm font-jost transition-colors hover:opacity-80 focus:outline-none cursor-default',
  {
    variants: {
      variant: {
        default: 'bg-primary-monkeyOrange text-secondary-white',
        secondary:
          'bg-primary-monkeyBlack text-secondary-white dark:bg-primary-monkeyWhite dark:text-secondary-darkGrey',
        destructive: 'bg-alert-red text-secondary-white',
        outline:
          'border-1 border-secondary-darkGrey dark:border-secondary-white ',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
