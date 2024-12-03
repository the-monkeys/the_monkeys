import * as React from 'react';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-dm_sans transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-base',
  {
    variants: {
      variant: {
        default:
          'bg-brand-orange text-text-dark light border-2 border-brand-orange hover:text-brand-orange hover:bg-opacity-0',
        destructive:
          'bg-alert-red text-text-dark border-2 border-alert-red hover:text-alert-red hover:bg-opacity-0',
        constructive:
          'bg-alert-green text-text-dark border-2 border-alert-green hover:text-alert-green hover:bg-opacity-0',
        outline:
          'border-2 border-foreground-light dark:border-foreground-dark hover:bg-foreground-light dark:hover:bg-foreground-dark hover:text-text-light dark:hover:text-text-dark',
        secondary:
          'bg-foreground-light text-text-light dark:bg-foreground-dark dark:text-text-dark border-2 border-foreground-light dark:border-foreground-dark hover:bg-foreground-light dark:hover:bg-foreground-dark hover:text-text-light dark:hover:text-text-dark hover:bg-opacity-0 dark:hover:bg-opacity-0',
        ghost: 'hover:bg-foreground-light dark:hover:bg-foreground-dark',
        link: 'underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-4 text-sm',
        lg: 'h-10 rounded-md px-4',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
