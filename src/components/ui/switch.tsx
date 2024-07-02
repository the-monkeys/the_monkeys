'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import * as SwitchPrimitives from '@radix-ui/react-switch';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex p-1 h-6 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-monkeyBlack data-[state=unchecked]:bg-primary-monkeyBlack/15 dark:data-[state=unchecked]:bg-primary-monkeyWhite/15 dark:data-[state=checked]:bg-primary-monkeyWhite',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-full bg-primary-monkeyBlack shadow-lg transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 dark:bg-primary-monkeyWhite data-[state=checked]:bg-primary-monkeyWhite dark:data-[state=checked]:bg-primary-monkeyBlack'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
