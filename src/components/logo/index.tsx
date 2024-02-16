"use client";

import { useEffect, useState } from "react";

import MobileLogo from "./MobileLogo";
import MixLogo from "./MixLogo";
import WebLogo from "./WebLogo";

interface LogoProps {
	showMobileLogo?: boolean;
	showSubHeading?: boolean;
	showMix?: boolean;
}

const Logo: React.FC<LogoProps> = ({
	showMobileLogo = false,
	showSubHeading = false,
	showMix = false,
}) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768); // Set your desired breakpoint
		};

		handleResize();

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div className="flex flex-col items-start gap-2">
			{showMobileLogo && isMobile ? (
				<MobileLogo />
			) : showMix ? (
				<MixLogo />
			) : (
				<WebLogo />
			)}
			{showSubHeading && (
				<p className="font-josefin_Sans">
					A Jungle of Insights and Clarity
				</p>
			)}
		</div>
	);
};

export default Logo;
