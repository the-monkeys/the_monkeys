"use client";

import * as React from "react";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "../utils";

const Switch = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
	<SwitchPrimitives.Root
		className={cn(
			"peer inline-flex p-1 h-6 w-10 shrink-0 cursor-pointer items-center rounded-full focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-foreground-dark data-[state=unchecked]:bg-foreground-light dark:data-[state=unchecked]:bg-foreground-dark dark:data-[state=checked]:bg-foreground-light",
			className,
		)}
		{...props}
		ref={ref}
	>
		<SwitchPrimitives.Thumb
			className={cn(
				"pointer-events-none block h-4 w-4 rounded-full bg-background-dark shadow-lg transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 dark:bg-background-light data-[state=checked]:bg-background-light dark:data-[state=checked]:bg-background-dark",
			)}
		/>
	</SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
