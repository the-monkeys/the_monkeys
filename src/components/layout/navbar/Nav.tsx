import { useState } from "react";

import Logo from "@/components/logo";
import SearchBox from "@/components/searchBox";
import Icon from "@/components/icon";
import ThemeSwitch from "@/components/basic/ThemeSwitch";
import CreateButton from "./CreateButton";

const Nav = () => {
	const [searchInput, setSearchInput] = useState<string>("");

	return (
		<div className="sticky top-0 left-0 px-5 py-2 w-full flex justify-between items-center bg-primary-monkeyWhite/75 dark:bg-primary-monkeyBlack/75 backdrop-blur-md">
			<div className="flex items-center gap-5">
				<Logo showMobileLogo={true} />
				<SearchBox
					setSearchInput={setSearchInput}
					className="w-32 md:w-64"
				/>
			</div>

			<div className="flex items-center gap-5">
				<div className="flex items-center gap-5">
					<Icon name="RiNotification3Line" />
					<ThemeSwitch />
					<Icon name="RiUser3Line" />
				</div>
				<div className="border-l-1 h-8 border-secondary-lightGrey/25"></div>
				<CreateButton />
			</div>
		</div>
	);
};

export default Nav;
