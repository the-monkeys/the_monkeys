import { FC } from "react";

import Icon from "../icon";
import Input from "../input";

type SearchBoxProps = {
	className?: string;
	setSearchInput: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBox: FC<SearchBoxProps> = ({ className, setSearchInput }) => {
	return (
		<div className="flex gap-2 items-center">
			<Icon name="RiSearchLine" />
			<div className="flex justify-center items-center">
				<Input
					className={className}
					type="text"
					placeholderText="Search here"
					setInputText={setSearchInput}
					variant="ghost"
					clearIcon
				/>
			</div>
		</div>
	);
};

export default SearchBox;
