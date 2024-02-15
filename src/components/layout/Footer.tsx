import { RiDiscordLine, RiGithubLine, RiTwitterLine } from "@remixicon/react";
import * as React from "react";
import Button from "../basic/Button";
import Logo from "../basic/Logo";

function Footer() {
  return (
    <footer className="bg-primary-monkeyWhite dark:bg-primary-monkeyBlack">
      <div className="flex gap-5 justify-between max-md:flex-wrap ">
        <div className="flex flex-col px-5">
          <Logo />
          <div className="text-base text-orange-50">
            A Jungle of Insights and Clarity
          </div>
          <div className="flex gap-2 justify-between mt-12 max-md:mt-10">
            <div className="flex flex-col flex-1">
              <div className="text-xl py-2">Get in Contact</div>
              <div>
                <input
                  type="email"
                  id="email"
                  aria-label="Email"
                  aria-role="textbox"
                  className="py-2 px-8 w-full rounded-lg border border-solid border-[color:var(--Monkeys-White,#FFF4ED)] text-white-100"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="justify-center self-end px-1 py-0.9 mt-6 text-base whitespace-nowrap bg-sky-500 rounded-lg">
              <Button bgColor="#ff462e">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="flex gap-5 justify-between items-start self-end px-5 mt-36 text-base text-neutral-600 max-md:mt-10">
          <div className="flex flex-col flex-1 self-stretch whitespace-nowrap">
            <div className="text-xl font-medium text-orange-50">Services</div>
            <div className="mt-5">Branding</div>
            <div className="mt-2">Design</div>
            <div className="mt-2">Marketing</div>
            <div className="mt-2">Advertisement</div>
          </div>
          <div className="flex flex-col flex-1">
            <div className="text-xl font-medium text-orange-50">Company</div>
            <div className="mt-3.5 whitespace-nowrap">About Us</div>
            <div className="mt-3">Contact</div>
            <div className="mt-3">Press Kit</div>
          </div>
          <div className="flex flex-col flex-1 whitespace-nowrap">
            <div className="text-xl font-medium text-orange-50">Legal</div>
            <div className="mt-3.5">Terms of Use</div>
            <div className="mt-3">Privacy Policy</div>
            <div className="mt-2">Cookie Policy</div>
          </div>
        </div>
      </div>
      <div className="mb-2 px-5 gap-5">
        <div className="flex gap-2 mt-1 w-[76px] max-md:mt-10">
          <RiDiscordLine />
          <RiTwitterLine />
          <RiGithubLine />
        </div>
        <div className="mt-2 text-xs text-neutral-600">
          Monkeys, 2024, All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

export default Footer;
