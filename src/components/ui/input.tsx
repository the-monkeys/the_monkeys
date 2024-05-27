import * as React from 'react';

import { cn } from '@/lib/utils';

import { InputVariantStyles } from '../input';
import { inputVariantStyles } from '../variantStyles';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: keyof InputVariantStyles;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'base', ...props }, ref) => {
    const variantStyles = inputVariantStyles[variant];

    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full px-3 py-1 text-sm shadow-sm rounded-lg transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 font-jost bg-primary-monkeyWhite/0 dark:bg-primary-monkeyBlack/0',
          variantStyles,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
