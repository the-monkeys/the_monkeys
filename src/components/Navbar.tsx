// ./src/components/Navbar.tsx
"use client";

import {
  RiAddLine,
  RiGenderlessLine,
  RiNotification3Line,
  RiToggleLine,
  RiUser3Line,
  RiPencilLine,
} from "@remixicon/react";
import { AiOutlineMinus } from "react-icons/ai";
import Logo from "./basic/Logo";
import { useState } from "react";
import ThemeSwitch from "./basic/ThemeSwitch";

const Navbar = () => {
  const [isInputVisible, setIsInputVisible] = useState(false);

  const handleToggle = () => {
    setIsInputVisible((prev) => !prev);
  };

  return (
    <header className="flex gap-5 justify-between px-5 py-4 w-full text-base max-md:flex-wrap max-md:max-w-full bg-primary-monkeyWhite dark:bg-primary-monkeyBlack">
      <div className="flex gap-5 justify-between items-center">
        <div>
          <Logo showMobileLogo={true} />
        </div>
        <div className="transform rotate-45">
          <div className="cursor-pointer" onClick={handleToggle}>
            <RiGenderlessLine className="transform rotate-90" />
          </div>
        </div>
        <div>
          {isInputVisible && (
            <div className="flex items-center relative transform rotate-15">
              <input
                type="text"
                className="border-b border-gray-300 w-64 focus:outline-none focus:border-blue-500 px-4 py-2"
                placeholder="Enter text"
              />
              <div className="absolute right-2 top-2 transform rotate-45">
                <RiAddLine className="cursor-pointer text-gray-500" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-5 justify-between items-center whitespace-nowrap text-zinc-100">
        <RiNotification3Line />
        <ThemeSwitch />
        <RiUser3Line />
        <AiOutlineMinus
          className="cursor-pointer text-gray-500 transform rotate-90"
          size={30}
        />
        <div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-monkeyOrange">
            <RiPencilLine />
          </div>
          <div>Create</div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
