"use client";

import Button from "@/components/button";
import Icon from "@/components/icon";
import Input from "@/components/input";
import Logo from "@/components/logo";
import Link from "next/link";
import { useState } from "react";

const Footer = () => {
	const [userMail, setUserMail] = useState<string>("");

	return (
		<footer className="px-5 pb-4 pt-10 flex flex-col gap-10 border-t-1 border-secondary-lightGrey/25">
			<div className="flex flex-col md:flex-row gap-10 item-start md:items-end justify-between">
				<div>
					<Logo showSubHeading showMix />
					<form className="mt-5 md:mt-10 flex flex-wrap items-end gap-2">
						<Input
							className="w-56 sm:w-60 md:w-64"
							type="email"
							placeholderText="Your email address"
							setInputText={setUserMail}
							label="Get in Touch"
							variant="border"
						/>
						<Button variant="primary" title="Subscribe" />
					</form>
				</div>
				<div className="flex justify-between flex-wrap gap-5">
					<div className="w-full sm:w-fit flex flex-col">
						<p className="font-josefin_Sans text-lg">Services</p>
						<p className="mt-1 font-jost text-secondary-lightGrey">
							Branding
						</p>
						<p className="mt-1 font-jost text-secondary-lightGrey">
							Design
						</p>
						<p className="mt-1 font-jost text-secondary-lightGrey">
							Marketing
						</p>
						<p className="mt-1 font-jost text-secondary-lightGrey">
							Advertisement
						</p>
					</div>
					<div className="w-full sm:w-fit flex flex-col">
						<p className="font-josefin_Sans text-lg">Company</p>
						<p className="mt-1 font-jost text-secondary-lightGrey">
							About Us
						</p>
						<p className="mt-1 font-jost text-secondary-lightGrey">
							Contact
						</p>
						<p className="mt-1 font-jost text-secondary-lightGrey">
							Press Kit
						</p>
					</div>
					<div className="w-full sm:w-fit flex flex-col">
						<p className="font-josefin_Sans text-lg">Legal</p>
						<p className="mt-1 font-jost text-secondary-lightGrey">
							Terms of Use
						</p>
						<p className="mt-1 font-jost text-secondary-lightGrey">
							Privacy Policy
						</p>
						<p className="mt-1 font-jost text-secondary-lightGrey">
							Cookie Policy
						</p>
					</div>
				</div>
			</div>
			<div className="mb-10 self-center w-fit flex flex-col items-center gap-2">
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
				<p className="w-fit font-josefin_Sans text-xs text-secondary-lightGrey">
					Monkeys, 2024, All Rights Reserved
				</p>
			</div>
		</footer>
	);
};

export default Footer;
