"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import Icon from "../icon";

const ThemeSwitch = () => {
	const [mounted, setMounted] = useState(false);
	const { setTheme, resolvedTheme } = useTheme();

	useEffect(() => setMounted(true), []);

	if (!mounted)
		return (
			<Image
				src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='red'%3E%3Cpath d='M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 5V19H19V5H5Z'%3E%3C/path%3E%3C/svg%3E"
				width={24}
				height={24}
				sizes="24x24"
				alt="Loading Light/Dark Toggle"
				priority={false}
				title="Loading Light/Dark Toggle"
			/>
		);

	if (resolvedTheme === "dark") {
		return <Icon name="RiToggleLine" onClick={() => setTheme("light")} />;
	}

	if (resolvedTheme === "light") {
		return <Icon name="RiToggleFill" onClick={() => setTheme("dark")} />;
	}
};

export default ThemeSwitch;
