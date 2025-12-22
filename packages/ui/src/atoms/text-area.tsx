import type * as React from "react";
import { cn } from "../utils";

function TextArea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"flex w-full min-h-24 px-4 py-3 text-sm rounded-md border border-border-light/60 dark:border-border-dark/60 bg-background-light dark:bg-background-dark focus-visible:outline-none focus-visible:border-foreground-light dark:focus-visible:border-foreground-dark disabled:cursor-not-allowed disabled:opacity-50 resize-none",
				className,
			)}
			{...props}
		/>
	);
}
export { TextArea };
