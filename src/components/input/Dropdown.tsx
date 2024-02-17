import React, { ChangeEvent } from "react";

type DropdownInputProps = {
	placeholderText: string;
	localInput: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const DropdownInput: React.FC<DropdownInputProps> = ({
	placeholderText,
	localInput,
	onChange,
}) => {
	return null;
};

export default DropdownInput;
