import * as React from "react";
import Link from "next/link";

import Button from "../button";
import Logo from "../logo";
import Icon from "../icon/index";

function Footer() {
	return (
		<footer className="px-5 py-4 bg-primary-monkeyWhite dark:bg-primary-monkeyBlack">
			<div className="flex gap-5 justify-between max-md:flex-wrap ">
				<div className="flex flex-col px-5">
					<Logo showSubHeading={true} showMix={true} />
					<div className="flex gap-2 justify-between mt-12 max-md:mt-10">
						<div className="flex flex-col flex-1">
							<div className="text-xl py-2">Get in Contact</div>
							<div>
								<input
									type="email"
									id="email"
									aria-label="Email"
									className="py-2 px-8 w-full rounded-lg border border-solid border-[color:var(--Monkeys-White,#FFF4ED)] text-white-100"
									placeholder="Enter your email"
								/>
							</div>
						</div>
						<div className="justify-center self-end px-1 py-0.9 mt-6 text-base whitespace-nowrap bg-sky-500 rounded-lg">
							<Button variant="primary" title="Subscribe" />
						</div>
					</div>
				</div>
				<div className="flex gap-5 justify-between items-start self-end px-5 mt-36 text-base text-neutral-600 max-md:mt-10">
					<div className="flex flex-col flex-1 self-stretch whitespace-nowrap">
						<div className="text-xl font-medium text-orange-50">
							Services
						</div>
						<div className="mt-5">Branding</div>
						<div className="mt-2">Design</div>
						<div className="mt-2">Marketing</div>
						<div className="mt-2">Advertisement</div>
					</div>
					<div className="flex flex-col flex-1">
						<div className="text-xl font-medium text-orange-50">
							Company
						</div>
						<div className="mt-3.5 whitespace-nowrap">About Us</div>
						<div className="mt-3">Contact</div>
						<div className="mt-3">Press Kit</div>
					</div>
					<div className="flex flex-col flex-1 whitespace-nowrap">
						<div className="text-xl font-medium text-orange-50">
							Legal
						</div>
						<div className="mt-3.5">Terms of Use</div>
						<div className="mt-3">Privacy Policy</div>
						<div className="mt-2">Cookie Policy</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-start gap-1">
				<div className="flex justify-center items-center gap-2">
					<Link
						className="flex items-center gap-2"
						href="https://discord.gg/HTuz82d8"
						target="_blank"
					>
						<Icon name="RiDiscordFill" size={20} />
					</Link>
					<Link
						className="flex items-center gap-2"
						href="https://github.com/the-monkeys/the_monkeys"
						target="_blank"
					>
						<Icon name="RiGithubFill" size={20} />
					</Link>

					<Link
						className="flex items-center gap-2"
						href="https://twitter.com/TheMonkeysLife"
						target="_blank"
					>
						<Icon name="RiTwitterXFill" size={20} />
					</Link>
				</div>
				<p className="w-fit font-josefin_Sans text-xs text-secondary-lightGrey cursor-default">
					Monkeys, 2024, All Rights Reserved
				</p>
			</div>
		</footer>
	);
}

export default Footer;
