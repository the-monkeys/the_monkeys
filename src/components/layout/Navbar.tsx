"use client";

import { useEffect, useState } from "react";

import Button from "../button";
import Icon from "../icon";
import Logo from "../logo";
import Input from "../input";
import NavbarOptions from "./NavOptions";

const Navbar = () => {
	const [searchInput, setSearchInput] = useState<string>("");
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<header className="px-5 py-4 w-full flex justify-between">
			<div className="flex items-center">
				<Logo showMobileLogo={true} />
				{!isMobile && (
					<>
						<div className="ml-5">
							<Icon name="RiSearchLine" />
						</div>
						<div className="flex justify-center items-center">
							<Input
								className="w-32 md:w-64"
								type="text"
								placeholderText="Search here"
								setInputText={setSearchInput}
								variant="ghost"
								clearIcon
							/>
						</div>
					</>
				)}
			</div>

			<div className="flex gap-2 sm:gap-5 justify-between items-center">
				<NavbarOptions />
				<div className="border-l-1 h-8 border-secondary-lightGrey border-opacity-25"></div>
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
