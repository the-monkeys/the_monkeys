// Input will take up the full width of the parent div, so set the width of the parent accordingly.
"use client";

import { ChangeEvent, useState } from "react";

import SearchInput from "./Search";
import FormInput from "./Form";
import DropdownInput from "./Dropdown";

type InputVariants = "search" | "form" | "dropdown";

type InputProps = {
	label?: string;
	placeholderText: string;
	variant: InputVariants;
	setInputText: React.Dispatch<React.SetStateAction<string>>;
};

const Input: React.FC<InputProps> = ({
	label,
	placeholderText,
	variant,
	setInputText,
}) => {
	const [localInput, setLocalInput] = useState<string>("");

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newText = e.target.value;
		setLocalInput(newText);
		setInputText(newText);
	};

	const handleIconClick = () => {
		setLocalInput("");
		setInputText("");
	};

	if (variant === "search") {
		return (
			<SearchInput
				placeholderText={placeholderText}
				localInput={localInput}
				onChange={handleInputChange}
				onIconClick={handleIconClick}
			/>
		);
	} else if (variant === "form") {
		return (
			<div>
				<p className="font-josefin_Sans text-lg">{label}</p>
				<FormInput
					placeholderText={placeholderText}
					localInput={localInput}
					onChange={handleInputChange}
				/>
			</div>
		);
	} else {
		return (
			<DropdownInput
				placeholderText={placeholderText}
				localInput={localInput}
				onChange={handleInputChange}
			/>
		);
	}
};

export default Input;
