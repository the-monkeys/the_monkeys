import Image from "next/image";

const WebLogo = () => {
	return (
		<>
			<Image
				className="dark:hidden"
				src={"/logo-full-dark.svg"}
				alt="TheMonkeys Logo"
				title="TheMonkeys Logo"
				height={30}
				width={119}
			/>
			<Image
				className="dark:block hidden"
				src={"/logo-full-light.svg"}
				alt="TheMonkeys Logo"
				title="TheMonkeys Logo"
				height={30}
				width={119}
			/>
		</>
	);
};

export default WebLogo;
