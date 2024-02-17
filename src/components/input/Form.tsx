import React, { ChangeEvent } from "react";

type FormInputProps = {
	placeholderText: string;
	localInput: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const FormInput: React.FC<FormInputProps> = ({
	placeholderText,
	localInput,
	onChange,
}) => {
	return (
		<input
			type="text"
			value={localInput}
			placeholder={placeholderText}
			className="px-4 py-2 w-full font-jost text-base md:text-md bg-primary-monkeyWhite dark:bg-primary-monkeyBlack border-[1px] focus:border-transparent  border-primary-monkeyBlack dark:border-primary-monkeyWhite rounded-md"
			onChange={onChange}
		/>
	);
};

export default FormInput;
