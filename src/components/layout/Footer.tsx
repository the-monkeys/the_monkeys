"use client";

import Link from "next/link";
import { useState } from "react";

import Button from "../button";
import Icon from "../icon/icon";
import Logo from "../logo";
import Input from "../input";

function Footer() {
	const [userMail, setUserMail] = useState<string>("");

	return (
		<footer className="px-5 py-4 flex flex-col">
			<div className="flex flex-col gap-10">
				<Logo showSubHeading={true} showMix={true} />
				<form className="flex items-end gap-2">
					<Input
						className="w-64"
						type="email"
						placeholderText="Your email address"
						setInputText={setUserMail}
						label="Get in Touch"
						variant="border"
					/>
					<Button variant="primary" title="Subscribe" />
				</form>
			</div>
			<div className="w-fit self-center md:self-end flex gap-5 items-start">
				<div className="flex flex-col">
					<p className="font-josefin_Sans text-lg">Services</p>
					<p className="mt-2 font-jost text-secondary-lightGrey">
						Branding
					</p>
					<p className="mt-2 font-jost text-secondary-lightGrey">
						Design
					</p>
					<p className="mt-2 font-jost text-secondary-lightGrey">
						Marketing
					</p>
					<p className="mt-2 font-jost text-secondary-lightGrey">
						Advertisement
					</p>
				</div>
				<div className="flex flex-col">
					<p className="font-josefin_Sans text-lg">Company</p>
					<p className="mt-2 font-jost text-secondary-lightGrey">
						About Us
					</p>
					<p className="mt-2 font-jost text-secondary-lightGrey">
						Contact
					</p>
					<p className="mt-2 font-jost text-secondary-lightGrey">
						Press Kit
					</p>
				</div>
				<div className="flex flex-col">
					<p className="font-josefin_Sans text-lg">Legal</p>
					<p className="mt-2 font-jost text-secondary-lightGrey">
						Terms of Use
					</p>
					<p className="mt-2 font-jost text-secondary-lightGrey">
						Privacy Policy
					</p>
					<p className="mt-2 font-jost text-secondary-lightGrey">
						Cookie Policy
					</p>
				</div>
			</div>
			<div className="mt-10 flex flex-col items-start gap-1">
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
}

export default Footer;
