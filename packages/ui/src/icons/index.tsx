import { cn } from "../utils";

export const CloseIcon = ({
	className,
	size = 24,
}: {
	className?: string;
	size?: number | string;
}) => {
	return (
		<svg
			className={cn("w-6 h-6 text-text-light dark:text-text-dark", className)}
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			fill="currentColor"
			viewBox="0 0 24 24"
		>
			<path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z" />
		</svg>
	);
};

export const CheckIcon = ({
	className,
	size = 24,
}: {
	className?: string;
	size?: number | string;
}) => (
	<svg
		className={cn("w-6 h-6 text-text-light dark:text-text-dark", className)}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		fill="none"
		viewBox="0 0 24 24"
	>
		<path
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M5 11.917 9.724 16.5 19 7.5"
		/>
	</svg>
);

export const AngleUp = ({
	className,
	size = 24,
}: {
	className?: string;
	size?: number | string;
}) => (
	<svg
		className={cn("w-6 h-6 text-text-light dark:text-text-dark", className)}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		fill="none"
		viewBox="0 0 24 24"
	>
		<path
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="m5 15 7-7 7 7"
		/>
	</svg>
);

export const AngleRight = ({
	className,
	size = 24,
}: {
	className?: string;
	size?: number | string;
}) => (
	<svg
		className={cn("w-6 h-6 text-text-light dark:text-text-dark", className)}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		fill="none"
		viewBox="0 0 24 24"
	>
		<path
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="m9 5 7 7-7 7"
		/>
	</svg>
);

export const AngleDown = ({
	className,
	size = 24,
}: {
	className?: string;
	size?: number | string;
}) => (
	<svg
		className={cn("w-6 h-6 text-text-light dark:text-text-dark", className)}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		fill="none"
		viewBox="0 0 24 24"
	>
		<path
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="m19 9-7 7-7-7"
		/>
	</svg>
);

export const AngleLeft = ({
	className,
	size = 24,
}: {
	className?: string;
	size?: number | string;
}) => (
	<svg
		className={cn("w-6 h-6 text-text-light dark:text-text-dark", className)}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		fill="none"
		viewBox="0 0 24 24"
	>
		<path
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="m15 19-7-7 7-7"
		/>
	</svg>
);

export const ArrowRight = ({
	className,
	size = 24,
}: {
	className?: string;
	size?: number | string;
}) => (
	<svg
		className={cn("w-6 h-6 text-text-light dark:text-text-dark", className)}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		fill="none"
		viewBox="0 0 24 24"
	>
		<path
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M19 12H5m14 0-4 4m4-4-4-4"
		/>
	</svg>
);

export const ArrowLeft = ({
	className,
	size = 24,
}: {
	className?: string;
	size?: number | string;
}) => (
	<svg
		className={cn("w-6 h-6 text-text-light dark:text-text-dark", className)}
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		fill="none"
		viewBox="0 0 24 24"
	>
		<path
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M5 12h14M5 12l4-4m-4 4 4 4"
		/>
	</svg>
);
