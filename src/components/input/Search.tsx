import { ChangeEvent } from "react";

import Icon from "../icon/icon";

type SearchInputProps = {
	placeholderText: string;
	localInput: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onIconClick: () => void;
};

const SearchInput: React.FC<SearchInputProps> = ({
	placeholderText,
	localInput,
	onChange,
	onIconClick,
}) => {
	return (
		<div className="w-full flex justify-center items-center gap-1">
			<input
				type="text"
				value={localInput}
				placeholder={placeholderText}
				className="py-2 flex-1 font-jost text-base md:text-md bg-primary-monkeyWhite dark:bg-primary-monkeyBlack focus:outline-none border-primary-monkeyBlack dark:border-primary-monkeyWhite"
				onChange={onChange}
			/>
			<Icon name="RiCloseLine" onClick={onIconClick} size={16} />
		</div>
	);
};

export default SearchInput;
