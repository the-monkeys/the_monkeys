import Image from "next/image";

const MobileLogo = () => {
	return (
		<>
			<Image
				className="dark:hidden"
				src={"/logo-dark.svg"}
				alt="TheMonkeys Logog"
				title="TheMonkeys Logo"
				height={10}
				width={30}
			/>
			<Image
				className="dark:block hidden"
				src={"/logo-light.svg"}
				alt="TheMonkeys Logo"
				title="TheMonkeys Logo"
				height={10}
				width={30}
			/>
		</>
	);
};

export default MobileLogo;
