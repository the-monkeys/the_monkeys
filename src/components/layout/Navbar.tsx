"use client";

import { useState } from "react";

import ThemeSwitch from "../basic/ThemeSwitch";
import Button from "../button";
import Icon from "../icon/icon";
import Logo from "../logo";
import Input from "../input";

const Navbar = () => {
	const [searchInput, setSearchInput] = useState<string>("");

	return (
		<header className="p-4 w-full flex justify-between">
			<div className="w-[30%] flex items-center">
				<Logo showMobileLogo={true} />
				<div className="ml-5">
					<Icon name="RiSearchLine" />
				</div>
				<div className="flex-1 flex justify-center items-center">
					<div className="flex-1">
						<Input
							type="text"
							placeholderText="Search here"
							setInputText={setSearchInput}
							variant="ghost"
							clearIcon
						/>
					</div>
				</div>
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
						animateIcon
					/>
					<p className="font-playfair_Display font-medium">Create</p>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
