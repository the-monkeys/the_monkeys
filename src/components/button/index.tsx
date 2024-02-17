import { twMerge } from "tailwind-merge";
import Icon, { IconName } from "../icon/icon";

import CircularButton from "./CircularButton";
import { InputHTMLAttributes } from "react";

type ButtonVariants =
	| "primary"
	| "secondary"
	| "alert"
	| "ghost"
	| "shallow"
	| "circular";

interface ButtonProps extends InputHTMLAttributes<HTMLButtonElement> {
	title: string;
	variant: ButtonVariants;
	// Left aligned icon
	startIcon?: boolean;
	// Right aligned icon
	endIcon?: boolean;
	iconName?: IconName;
	animateIcon?: boolean;
	toolTip?: boolean;
	toolTipSide?: "top" | "right" | "bottom" | "left";
}

const Button: React.FC<ButtonProps> = ({
	title,
	variant,
	startIcon,
	endIcon,
	iconName = "RiErrorWarningLine",
	animateIcon,
	toolTip,
	toolTipSide,
	onClick,
	disabled,
}) => {
	const baseStyles =
		"px-4 py-2 h-10 rounded-lg cursor-pointer transition-all";
	const primaryStyles = "bg-primary-monkeyOrange text-primary-monkeyWhite";
	const secondaryStyes = "bg-secondary-darkGrey text-secondary-white";
	const alertStyles = "bg-alert-red text-secondary-white";
	const shallowStyles =
		"text-secondary-darkGrey dark:text-secondary-white bg-secondary-darkGrey/0 dark:bg-secondary-white/0 hover:bg-secondary-darkGrey dark:hover:bg-secondary-white/100 hover:bg-opcaity-100 hover:text-secondary-white dark:hover:text-secondary-darkGrey border-[1px] border-secondary-darkGrey dark:border-secondary-white";
	const ghostStyles =
		"text-primary-monkeyBlack dark:text-primary-monkeyWhite hover:bg-primary-monkeyBlack dark:hover:bg-primary-monkeyWhite hover:text-primary-monkeyWhite dark:hover:text-primary-monkeyBlack";

	const getStyles = () => {
		switch (variant) {
			case "primary":
				return `${baseStyles} ${primaryStyles}`;
			case "secondary":
				return `${baseStyles} ${secondaryStyes}`;
			case "alert":
				return `${baseStyles} ${alertStyles}`;
			case "ghost":
				return `${baseStyles} ${ghostStyles}`;
			case "shallow":
				return `${baseStyles} ${shallowStyles}`;
		}
	};

	if (variant === "circular") {
		return (
			<CircularButton
				animate={animateIcon}
				iconName={iconName}
				onClick={onClick}
				disabled={disabled}
			/>
		);
	}

	return (
		<button
			className={twMerge(
				getStyles(),
				!disabled && "hover:scale-95",
				disabled && "opacity-75"
			)}
			onClick={onClick}
			disabled={disabled}
		>
			<div className="flex gap-4 justify-between items-center">
				{startIcon && (
					<Icon name={iconName} size={20} hasHover={false} />
				)}
				<p className="font-jost">{title}</p>
				{endIcon && <Icon name={iconName} size={20} hasHover={false} />}
			</div>
		</button>
	);
};

export default Button;
