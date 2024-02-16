"use client";

import { useState } from "react";

import Icon from "../icon";
import Logo from "../logo";
import ThemeSwitch from "../basic/ThemeSwitch";
import Button from "../button";

const Navbar = () => {
	const [isInputVisible, setIsInputVisible] = useState(false);

	const handleToggle = () => {
		setIsInputVisible((prev) => !prev);
	};

	return (
		<header className="flex gap-5 justify-between px-5 py-4 w-full text-base max-md:flex-wrap max-md:max-w-full bg-primary-monkeyWhite dark:bg-primary-monkeyBlack">
			<div className="flex gap-5 justify-between items-center">
				<div>
					<Logo showMobileLogo={true} />
				</div>
				<div>
					<Icon name="RiSearchLine" onClick={handleToggle} />
				</div>
				<div>
					{isInputVisible && (
						<div className="flex items-center relative transform rotate-15">
							<input
								type="text"
								className="border-b border-gray-300 w-64 focus:outline-none focus:border-blue-500 px-4 py-2"
								placeholder="Enter text"
							/>
						</div>
					)}
				</div>
			</div>

			<div className="flex gap-5 justify-between items-center whitespace-nowrap text-zinc-100">
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
