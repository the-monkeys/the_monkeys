"use client";

import { useState } from "react";

import ThemeSwitch from "../basic/ThemeSwitch";
import Button from "../button";
import Icon from "../icon/icon";
import Logo from "../logo";
import Input from "../input";

const Navbar = () => {
	const [searchInput, setSearchInput] = useState<string>("");
	const [inputVisibility, setInputVisibility] = useState<boolean>(false);

	const handleInputToggle = () => {
		setInputVisibility((prevVal) => !prevVal);
	};

	return (
		<header className="p-4 w-full flex justify-between">
			<div className="w-2/5 flex items-center gap-4">
				<div>
					<Logo showMobileLogo={true} />
				</div>
				<div>
					<Icon name="RiSearchLine" onClick={handleInputToggle} />
				</div>
				{inputVisibility && (
					<div className="flex-1">
						<Input
							variant="search"
							placeholderText="search here"
							setInputText={setSearchInput}
						/>
					</div>
				)}
			</div>

			<div className="flex gap-5 justify-between items-center">
				<Icon name="RiNotification3Line" />
				<ThemeSwitch />
				<Icon name="RiUser3Line" />
				<div className="flex flex-col items-center">
					<Button
						title="Create"
						variant="circular"
						iconName="RiPencilLine"
						animate={true}
					/>
					<p className="font-playfair_Display font-medium">Create</p>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
