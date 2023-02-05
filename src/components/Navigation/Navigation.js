import { Link, NavLink } from "react-router-dom";
import { Logo } from "../Logo";

export const Navigation = () => {
  return (
    <nav className="relative md:px-2 shadow-sm z-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          <Logo />
          <div className="hidden md:flex justify-between items-center space-x-6">
            <NavLink
              to="/login"
              className="py-2 px-6 bg-transparent baseline 
              cursor-pointer border-2 border-transparent main-link hover:text-black "
            >
              Login
            </NavLink>
            <NavLink
              className="py-2 px-6 text-white  bg-lightBlack baseline
             cursor-pointer rounded-sm hover:bg-transparent hover:text-lightBlack
             border-2 hover: border-lightBlack"
              to="/register"
            >
              Sign Up
            </NavLink>
          </div>
          {/* Hamburger Menu Button */}
          <button
            onClick={() => {
              document.querySelector(".mobile-nav").classList.toggle("hidden");
            }}
            className="md:hidden h-[20px] w-[25px] flex flex-col justify-between"
          >
            <span className="block h-0.5 w-8 bg-lightBlack"></span>
            <span className="block h-0.5 w-8 bg-lightBlack"></span>
            <span className="block h-0.5 w-8 bg-lightBlack"></span>
          </button>
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
      {/* Dropdown Nav */}
      <div className="md:hidden">
        <ul
          className="mobile-nav hidden absolute flex flex-col items-center self-end py-8 space-y-6 
        bg-white sm:self-center w-full shadow-md"
        >
          <Link className="" to="/contact">
            Trending
          </Link>
          <Link className="" to="/">
            Technology
          </Link>
          <Link className="" to="/">
            Lifestyle
          </Link>
          <Link className="" to="/">
            Health
          </Link>
          <Link className="" to="/">
            Business & Finance
          </Link>
          <Link className="" to="/">
            Philosophy & psychology
          </Link>
          <Link className="" to="/register">
            Register
          </Link>
          <Link className="" to="/login">
            Login
          </Link>
        </ul>
      </div>
    </nav>
  );
};
