import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import { Dropdown } from "./Dropdown/Dropdown";
import { SignupBtn } from './SignupBtn'
import MenuBtn from "../../assets/menu_icon.png";

export const Navigation = () => {
  const [showDropdown, setShowDropdown] = useState(false)

  document.onclick = function(clickevent) {
    if (clickevent.target.id !== 'menu' && clickevent.target !== 'path') {
      setShowDropdown(false)
    }
  }
  return (
    <nav className="relative md:px-2 shadow-sm z-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          <Logo />
          <SignupBtn />
            <div id='cont'
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
            className="absolute right-[19px] top-[9.5px] w-12">
            <img id="menu" className="w-full" src={MenuBtn} alt='menu btn'/>
            </div>
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