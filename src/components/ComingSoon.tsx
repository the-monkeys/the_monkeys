import Icon from "@/components/Icon";
import Logo from "@/components/basic/Logo";
import ThemeSwitch from "@/components/basic/ThemeSwitch";

import Link from "next/link";

const ComingSoon = () => {
	return (
		<div className="w-4/5 md:w-3/5 flex flex-col items-center justify-center min-h-screen">
			<div className="w-full mb-16 flex item-center justify-between">
				<Logo />
				<ThemeSwitch />
			</div>
			<h1 className="font-playfair_Display text-3xl md:text-4xl dark:text-secondary-white font-extrabold text-center mb-8">
				We&apos;re Coming Soon!
			</h1>
			<p className="font-josefin_Sans text-xl md:text-2xl dark:text-secondary-white text-gray-600 text-center mb-2">
				Our website is currently under construction!
			</p>
			<p className="font-jost text-base md:text-lg text-secondary-lightGray text-center mb-4">
				Get ready to be part of the excitement and be the first to
				experience our grand reveal. Stay tuned for updates and
				announcements. Thank you for your anticipation and patience!
			</p>
			<div className="w-fit flex flex-col gap-2">
				<Link
					className="group flex items-center gap-2"
					href="https://github.com/the-monkeys/the_monkeys"
					target="_blank"
				>
					<Icon
						title="Github"
						name="RiGithubFill"
						size={24}
						color="#ff462e"
					/>
					<p className="font-josefin_Sans text-base md:text-lg group-hover:underline">
						Github
					</p>
				</Link>
				<Link
					className="group flex items-center gap-2"
					href="https://twitter.com/TheMonkeysLife"
					target="_blank"
				>
					<Icon
						title="X"
						name="RiTwitterFill"
						size={24}
						color="#ff462e"
					/>
					<p className="font-josefin_Sans text-base md:text-lg group-hover:underline">
						Twitter
					</p>
				</Link>
			</div>
		</div>
	);
};

export default ComingSoon;
