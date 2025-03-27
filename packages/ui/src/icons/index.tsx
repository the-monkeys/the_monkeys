import { cn } from "../utils";

export const CloseIcon = ({
	className,
	size = 24,
}: { className?: string; size?: number | string }) => {
	return (
		<svg
			className={cn("w-6 h-6 text-gray-800 dark:text-white", className)}
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
				d="M6 18 17.94 6M18 18 6.06 6"
			/>
		</svg>
	);
};

export const CheckIcon = ({
	className,
	size = 24,
}: { className?: string; size?: number | string }) => (
	<svg
		className={cn("w-6 h-6 text-gray-800 dark:text-white", className)}
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
}: { className?: string; size?: number | string }) => (
	<svg
		className={cn("w-6 h-6 text-gray-800 dark:text-white", className)}
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
}: { className?: string; size?: number | string }) => (
	<svg
		className={cn("w-6 h-6 text-gray-800 dark:text-white", className)}
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
}: { className?: string; size?: number | string }) => (
	<svg
		className={cn("w-6 h-6 text-gray-800 dark:text-white", className)}
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
}: { className?: string; size?: number | string }) => (
	<svg
		className={cn("w-6 h-6 text-gray-800 dark:text-white", className)}
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
}: { className?: string; size?: number | string }) => (
	<svg
		className={cn("w-6 h-6 text-gray-800 dark:text-white", className)}
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
}: { className?: string; size?: number | string }) => (
	<svg
		className={cn("w-6 h-6 text-gray-800 dark:text-white", className)}
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
