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
		<footer className="p-4">
			<div className="flex justify-between">
				<div className="pb-10 flex flex-col gap-10">
					<Logo showSubHeading={true} showMix={true} />
					<form className="flex justify-center items-end gap-2">
						<div className="w-72">
							<Input
								type="email"
								placeholderText="Your email address"
								setInputText={setUserMail}
								label="Get in Touch"
								variant="border"
							/>
						</div>
						<Button variant="primary" title="Subscribe" />
					</form>
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
