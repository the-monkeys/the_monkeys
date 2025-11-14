import type * as React from "react";

import { cn } from "../utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"border-border-light/60 dark:border-border-dark/60 placeholder:text-muted-foreground focus-visible:border-foreground-light dark:focus-visible:border-foreground-dark aria-invalid:ring-alert-red/20 dark:aria-invalid:ring-alert-red/40 aria-invalid:border-alert-red bg-background-light dark:bg-background-dark flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
