import type * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "../utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full px-3 py-[2px] text-sm focus:outline-none cursor-default",
	{
		variants: {
			variant: {
				default:
					"bg-background-dark dark:bg-background-light text-text-dark dark:text-text-light hover:bg-foreground-dark dark:hover:bg-foreground-light",
				secondary:
					"bg-foreground-light text-text-light dark:bg-foreground-dark dark:text-text-dark border-1 border-foreground-light dark:border-foreground-dark hover:bg-foreground-light dark:hover:bg-foreground-dark hover:text-text-light dark:hover:text-text-dark hover:bg-opacity-0 dark:hover:bg-opacity-0",
				outline:
					"border-1 border-border-light dark:border-border-dark hover:bg-foreground-light dark:hover:bg-foreground-dark hover:text-text-light dark:hover:text-text-dark",
				destructive:
					"bg-alert-red text-text-dark border-1 border-alert-red hover:text-alert-red hover:bg-opacity-0",
				brand:
					"bg-brand-orange text-text-dark light border-1 border-brand-orange hover:text-brand-orange hover:bg-opacity-0",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
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
