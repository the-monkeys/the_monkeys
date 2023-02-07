import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import { Dropdown } from "./Dropdown/Dropdown";
import { SignupBtn } from './SignupBtn'

export const Navigation = () => {
  const [showDropdown, setShowDropdown] = useState(false)

  document.onclick = function(clickevent) {
    if (clickevent.target.id !== 'menu') {
      setShowDropdown(false)
    }
  }
  return (
    <nav className="relative md:px-2 shadow-sm z-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          <Logo />
          <SignupBtn />
          <button
          id="menu"
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
            className="md:hidden h-[20px] w-[25px] flex flex-col justify-between z-1"
          >
            <span className="block h-0.5 w-8 bg-lightBlack"></span>
            <span className="block h-0.5 w-8 bg-lightBlack"></span>
            <span className="block h-0.5 w-8 bg-lightBlack"></span>
          </button>
        </div>
      </div>
      <div className="hidden flex container md:flex items-center justify-center">
        <ul
         className="py-4 flex justify-center items-center space-x-14">
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
      {showDropdown ? <Dropdown /> : ''}
    </nav>
  )
}