import { ChangeEvent, InputHTMLAttributes, forwardRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Icon from "../icon/icon";

type InputVariants = "border" | "ghost" | "area";

interface InputProps
	extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
	label?: string;
	placeholderText: string;
	variant: InputVariants;
	clearIcon?: boolean;
	setInputText: React.Dispatch<React.SetStateAction<string>>;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
	(
		{
			type,
			disabled,
			label,
			placeholderText,
			variant,
			clearIcon,
			setInputText,
		},
		ref
	) => {
		const [localInput, setLocalInput] = useState<string>("");

		const baseStyles =
			"px-4 py-2 flex-1 font-jost text-base md:text-md bg-primary-monkeyWhite dark:bg-primary-monkeyBlack";
		const borderInputStyles =
			"border-2 focus:outline-none rounded-lg focus:border-secondary-lightGrey";
		const ghostInputStyles = "focus:outline-none";

		const getStyles = () => {
			switch (variant) {
				case "border":
					return `${baseStyles} ${borderInputStyles}`;
				case "ghost":
					return `${baseStyles} ${ghostInputStyles}`;
				case "area":
					return `${baseStyles} ${borderInputStyles}`;
			}
		};

		const handleInputChange = (
			e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
		) => {
			const newText = e.target.value;
			setLocalInput(newText);
			setInputText(newText);
		};

		const handleClearInput = () => {
			setLocalInput("");
			setInputText("");
		};

		return (
			<div className="flex flex-col items-start">
				{label && (
					<p className="pl-1 font-josefin_Sans text-lg">{label}</p>
				)}
				{variant === "area" ? (
					<textarea
						placeholder={
							!disabled ? placeholderText : "Input disabled"
						}
						value={localInput}
						className={twMerge(
							getStyles(),
							"resize-none",
							disabled && "opacity-75"
						)}
						rows={3}
						disabled={disabled}
						onChange={handleInputChange}
						ref={ref as React.RefObject<HTMLTextAreaElement>}
					/>
				) : (
					<div className="w-full flex justify-center items-center gap-1">
						<input
							type={type}
							placeholder={
								!disabled ? placeholderText : "Input disabled"
							}
							value={localInput}
							className={twMerge(
								getStyles(),
								"h-10",
								disabled && "opacity-75"
							)}
							disabled={disabled}
							onChange={handleInputChange}
							ref={ref as React.RefObject<HTMLInputElement>}
						/>
						{clearIcon && (
							<Icon
								name="RiCloseLine"
								size={16}
								onClick={handleClearInput}
							/>
						)}
					</div>
				)}
			</div>
		);
	}
);

Input.displayName = "Input";

export default Input;
