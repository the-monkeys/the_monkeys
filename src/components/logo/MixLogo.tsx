import Image from "next/image";

const MixLogo = () => {
	return (
		<>
			<Image
				className="dark:hidden"
				src={"/logo-full-mix-dark.svg"}
				alt="TheMonkeys Logo"
				title="TheMonkeys Logo"
				height={30}
				width={119}
			/>
			<Image
				className="dark:block hidden"
				src={"/logo-full-mix-light.svg"}
				alt="TheMonkeys Logo"
				title="TheMonkeys Logo"
				height={30}
				width={119}
			/>
		</>
	);
};

export default MixLogo;
