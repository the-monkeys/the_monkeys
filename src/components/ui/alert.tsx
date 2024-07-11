import * as React from 'react';

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';

const alertVariants = cva(
  'relative w-full rounded-lg border-1 border-secondary-lightGrey/25 p-4 bg-secondary-lightGrey/10 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-primary-monkeyWhite dark:bg-primary-monkeyBlack',
        destructive: 'text-alert-red border-alert-red bg-alert-red/10',
        constructive: 'text-alert-green border-alert-green bg-alert-green/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role='alert'
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      'font-josefin_Sans text-lg leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-1 font-jost [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
