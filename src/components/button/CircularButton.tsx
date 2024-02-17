import { FC, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

import Icon, { IconName } from "../icon/icon";

interface CircularButtonProps extends InputHTMLAttributes<HTMLButtonElement> {
	iconName?: IconName;
	animate?: boolean;
}

const CircularButton: FC<CircularButtonProps> = ({
	iconName = "RiErrorWarningLine",
	animate,
	disabled,
	onClick,
}) => {
	return (
		<button
			className={twMerge(
				"group w-8 h-8 cur rounded-full flex items-center justify-center bg-primary-monkeyOrange cursor-pointer transition-all",
				disabled && "opacity-75"
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
