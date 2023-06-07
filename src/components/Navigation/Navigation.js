import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import { Navbar } from "./Navbar";
import { SignupBtn } from "./SignupBtn";
import { useSelector } from "react-redux";
import MenuBtn from "../../assets/menu_icon.png";
import { ProfileMenu } from "../../components/ProfileMenu";

export const Navigation = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);

  return (
    <nav className="relative md:px-2 shadow-sm z-10" data-testid="navigation">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          <Logo />
          {isAuthenticated && <ProfileMenu />}
          {!isAuthenticated && <SignupBtn />}
          <div
            id="cont"
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
            className="absolute right-[19px] top-[9.5px] w-12"
          >
            <img
              id="menu"
              className="md:hidden w-full"
              src={MenuBtn}
              alt="menu btn"
            />
          </div>
        </div>
      </div>
      <div className="hidden flex container md:flex items-center justify-center">
        <ul className="py-4 flex justify-center items-center space-x-14">
          <Link className="navlinks main-link" to="/">
            Trending
          </Link>
          <Link className="navlinks main-link" to="/">
            Technology
          </Link>
          <Link className="navlinks main-link" to="/">
            Lifestyle
          </Link>
          <Link className="navlinks main-link" to="/">
            Health
          </Link>
          <Link className="navlinks main-link" to="/">
            Business & Finance
          </Link>
          <Link className="navlinks main-link" to="/">
            Philosophy & psychology
          </Link>
        </ul>
      </div>
      {showDropdown ? <Navbar /> : ""}
    </nav>
  );
};
