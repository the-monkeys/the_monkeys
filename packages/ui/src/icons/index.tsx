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
