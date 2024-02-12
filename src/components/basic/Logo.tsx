import Image from "next/image";

const Logo = () => {
	return (
		<>
			<Image
				src={"/monkeysTitleDark.png"}
				alt="Monkeys Logo"
				title="The Monkeys"
				height={30}
				width={119}
				className="dark:hidden"
			/>
			<Image
				src={"/monkeysTitleLight.png"}
				alt="Monkeys Logo"
				title="The Monkeys"
				height={30}
				width={119}
				className="dark:block hidden"
			/>
		</>
	);
};

export default Logo;
