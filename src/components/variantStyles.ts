import { ButtonVariantStyles } from "./button";
import { InputVariantStyles } from "./input";

export const buttonVariantStyles: ButtonVariantStyles = {
	base: "px-4 py-2 font-jost text-xs sm:text-sm md:text-base rounded-lg cursor-pointer transition-all",
	primary:
		"bg-primary-monkeyOrange text-primary-monkeyWhite hover:rounded-sm",
	secondary: "bg-secondary-darkGrey text-secondary-white hover:rounded-sm",
	alert: "text-primary-monkeyWhite hover:text-alert-red border-2 border-alert-red bg-alert-red hover:bg-opacity-0",
	shallow:
		"hover:bg-primary-monkeyBlack dark:hover:bg-primary-monkeyWhite hover:text-primary-monkeyWhite dark:hover:text-primary-monkeyBlack border-2 border-primary-monkeyBlack dark:border-primary-monkeyWhite",
	ghost: "text-primary-monkeyBlack dark:text-primary-monkeyWhite hover:bg-primary-monkeyBlack dark:hover:bg-primary-monkeyWhite hover:text-primary-monkeyWhite dark:hover:text-primary-monkeyBlack",
};

export const inputVariantStyles: InputVariantStyles = {
	base: "px-4 py-2 font-jost text-xs sm:text-sm md:text-base bg-primary-monkeyWhite/0 dark:bg-primary-monkeyBlack/0",
	border: "border-1 border-secondary-lightGrey/75 focus:border-secondary-lightGrey/25 focus:outline-none rounded-lg",
	ghost: "focus:outline-none",
};
