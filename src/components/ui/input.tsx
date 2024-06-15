import * as React from 'react';

import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const inputVariants = cva(
  'h-10 flex w-full px-4 text-sm rounded-lg file:border-0 file:rounded-sm file:mr-4 file:text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-jost bg-primary-monkeyWhite dark:bg-primary-monkeyBlack',
  {
    variants: {
      variant: {
        default:
          'border-1 border-secondary-lightGrey/25 focus-visible:border-secondary-lightGrey/75',
        ghost: 'border-none',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  asChild?: boolean;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
