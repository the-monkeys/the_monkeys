import React from "react";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { v4 as uuidv4 } from 'uuid';
import {
  StyledMenuButton,
  StyledMenuItem,
  StyledMenuItems,
  StyledSpan,
  StyledSvg,
} from "./ProfileMenu.styles";
import { logoutUser } from "../../redux/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BsPencilSquare } from 'react-icons/bs'

const LINKS = ["/profile", "/settings"];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}



export const ProfileMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  let paramsData = useParams()

  console.log(paramsData, '/sfsd  ')

  const handleLogOut = () => {
    dispatch(logoutUser())
    navigate('/');

  }


  return (
    <div className="flex justify-items-center items-center px-12 gap-4">
      {/* <Link className="px-8" to={"/write/" + uuidv4()} key={uuidv4()}>
              Write
            </Link> */}
      <Link className="px-4 py-2 h-12 w-32 bg-[#E4E6E7]  rounded-lg flex item-center justify-center" to={"/type/" + uuidv4()} key={uuidv4()}>
        <BsPencilSquare className="py-2 text-4xl" /> Editor
      </Link>

      <Menu
        as="div"
        className="relative inline-block text-left"
        style={{ padding: "10px 0px" }}
      >
        <StyledMenuButton>
          <img
            className="dropdown-image"
            width={30}
            length={30}
            alt="profile"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIsAAACLCAMAAABmx5rNAAAAMFBMVEXk5ueutLfo6uunrrGrsbTJzc/BxsjT1ti5vsHe4OGxt7rP0tTa3d7h4+S8wcTX2ttehllwAAADC0lEQVR4nO2a23LrIAxFQTYXgy///7cHbDdN2zhIxJI9c1gvTd/WbAQGhFKNRqPRaDQajUaj0Wj8JwCAmrYfV4uoxdjZez/PNo4X6sAQfdf3vV5JP7rZTZfowGDDrvGg74NR4jbJpPttsuloI60S9UuTzWYUjcYemqw2Rk5m+FMov2VmKZXxvYikDEIlyXiJYZowKkLJeJyLQAHD+xn0Q8YxqzisSYbZhaLSW85RAoMeoVVmYXQZAkUlzSW+YIixJJmRzUXRTHLFcJmAI8aSZLhc1Ex3iVwVQ1bRmqt6l47uEiYWFcLy/wTPEgPYr+IzfWRxmWgL3e7C8x0gLro7PHsq1H7uLywuS5VKx+JCX3X5XJYbudwqlxoVJpc7zaM7rS93Wnfv9D0i73ZXmI4C4332L/Stt+bb1xVuo17Btt+91TmAdJpeVdjOR/c6NxKXO87zNDkYxliSDCUY3vsX4oaK+cKOMErc93X5C4mUkbiIx97v8i0tTwwoFZF7bwWIVUauOVHuk4gM0I59u5Xhu416BbjjaPowyLYcYTrqNzLtcEs2L/qw3lzTpIbJ+bUvvWmkP3aR7wg/bEAtcW3cz9Zc2rffbJ64TCJrTGOKxdiMMdEtg7xRklii9brr8nOGb9L/OtjoBqFHH6AmZ0PQ/dH6kos4zJHdB2A0/ljj5+y2js8mi6A8HjppjrO8QQGI/vg9xXE657/6gMmUvs2HOvbUZx/JhBzJk40+0QZiZSZPNufUDbgPMnnY9Ce8XUpf489NVhv/6UCdEsqXzYeHlJNC2WV8/YYPFPZchpXRS6UM1F26v6WrGyfa8xIsVXcPUNeiKVKRTMU9IRJyMlyprDK0ZAB1fq+WoR0rq9ozeAhTG+gPOmgEtAu4iiYECfxla1XTiiiDHKW69xxEAi6WUUAFObHZC3eXwcQycBfu7oIIRqRaMojun8Ak2kA8kIxCsSBugGEWUkFUL0jFknsXhWBEFpfdpTCTQKxcEoV7erEZnfGFepEr3fIKEzpBhkIwIEhBpdFoNBqNK/gH2kAk3HwBy34AAAAASUVORK5CYII="
          />
          <StyledSpan>
            Profile
            <StyledSvg />
          </StyledSpan>
        </StyledMenuButton>
        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <StyledMenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {LINKS.map((link) => (
              <StyledMenuItem key={link}>
                {({ active }) => (
                  <Link
                    to={link}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2"
                    )}
                  >
                    {link.replace("/", "")}
                  </Link>
                )}
              </StyledMenuItem>
            ))}
            <StyledMenuItem>
              {({ active }) => (
                <StyledMenuButton
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2"
                  )}
                  onClick={handleLogOut}
                >
                  Logout
                </StyledMenuButton>
              )}
            </StyledMenuItem>
          </StyledMenuItems>
        </Transition>
      </Menu>
    </div>
  );
};
