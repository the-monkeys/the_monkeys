import * as React from 'react';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-jost transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-base',
  {
    variants: {
      variant: {
        default:
          'bg-primary-monkeyOrange text-secondary-white border-2 border-primary-monkeyOrange hover:text-primary-monkeyOrange hover:bg-opacity-0',
        destructive:
          'bg-alert-red text-secondary-white border-2 border-alert-red hover:text-alert-red hover:bg-opacity-0',
        constructive:
          'bg-alert-green text-secondary-white border-2 border-alert-green hover:text-alert-green hover:bg-opacity-0',
        outline:
          'border-2 border-secondary-darkGrey dark:border-secondary-white hover:bg-secondary-darkGrey dark:hover:bg-secondary-white hover:text-secondary-white dark:hover:text-secondary-darkGrey',
        secondary:
          'bg-primary-monkeyBlack text-secondary-white dark:bg-primary-monkeyWhite dark:text-secondary-darkGrey border-2 border-primary-monkeyBlack dark:border-primary-monkeyWhite hover:text-secondary-darkGrey dark:hover:text-secondary-white hover:bg-opacity-0 dark:hover:bg-opacity-0',
        ghost:
          'hover:bg-primary-monkeyBlack hover:text-secondary-white dark:hover:bg-primary-monkeyWhite dark:hover:text-secondary-darkGrey',
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
