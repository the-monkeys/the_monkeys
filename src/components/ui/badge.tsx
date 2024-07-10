import * as React from 'react';

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center ring-1 rounded-full px-4 py-1 text-sm font-jost transition-colors focus:outline-none cursor-default',
  {
    variants: {
      variant: {
        default: 'ring-primary-monkeyOrange bg-primary-monkeyOrange/25',
        secondary:
          'ring-secondary-darkGrey/25 dark:ring-secondary-white/25 bg-secondary-darkGrey/15 dark:bg-secondary-white/15',
        destructive: 'ring-alert-red bg-alert-red/25',
        outline: 'ring-secondary-darkGrey/25 dark:ring-secondary-white/25',
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
