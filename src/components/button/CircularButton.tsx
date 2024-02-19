import { FC, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

import Icon, { IconName } from "../icon";

interface CircularButtonProps extends InputHTMLAttributes<HTMLButtonElement> {
	iconName?: IconName;
	animate?: boolean;
}

const CircularButton: FC<CircularButtonProps> = ({
	iconName = "RiErrorWarningLine",
	animate,
	disabled,
	className,
	onClick,
}) => {
	return (
		<button
			className={twMerge(
				"group w-8 h-8 cur rounded-full flex items-center justify-center bg-primary-monkeyOrange cursor-pointer transition-all",
				className,
				disabled && "opacity-75 cursor-not-allowed"
			)}
			onClick={onClick}
			disabled={disabled}
		>
			<div
				className={twMerge(
					!disabled && animate && "group-hover:animate-shake"
				)}
			>
				<Icon
					name={iconName}
					size={18}
					customColor={true}
					color="#fff4ed"
					hasHover={false}
				/>
			</div>
		</button>
	);
};

export default CircularButton;
