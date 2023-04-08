import { useState } from "react";
import { Link } from "react-router-dom";

/*Main Folder for the Compenets Route */

const Dropdown = () => {
  const [color, setColor] = useState("black");

  function changeColor() {
    setColor("white");
  }

  function blackColor() {
    setColor("black");
  }

  return (
    <div className="D-box">
      <button
        id="dropdownHoverButton"
        data-dropdown-toggle="dropdownHover"
        data-dropdown-trigger="hover"
        class="text-white bg-black hover:bg-black font-medium text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-black dark:hover:bg-black dark:focus:ring-black"
        type="button"
        style={{ backgroundColor: color, borderColor: "black" }}
        onMouseOver={changeColor}
        onMouseOut={blackColor}
      >
        <img
          className="dropdown-image"
          width={25}
          length={20}
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIsAAACLCAMAAABmx5rNAAAAMFBMVEXk5ueutLfo6uunrrGrsbTJzc/BxsjT1ti5vsHe4OGxt7rP0tTa3d7h4+S8wcTX2ttehllwAAADC0lEQVR4nO2a23LrIAxFQTYXgy///7cHbDdN2zhIxJI9c1gvTd/WbAQGhFKNRqPRaDQajUaj0Wj8JwCAmrYfV4uoxdjZez/PNo4X6sAQfdf3vV5JP7rZTZfowGDDrvGg74NR4jbJpPttsuloI60S9UuTzWYUjcYemqw2Rk5m+FMov2VmKZXxvYikDEIlyXiJYZowKkLJeJyLQAHD+xn0Q8YxqzisSYbZhaLSW85RAoMeoVVmYXQZAkUlzSW+YIixJJmRzUXRTHLFcJmAI8aSZLhc1Ex3iVwVQ1bRmqt6l47uEiYWFcLy/wTPEgPYr+IzfWRxmWgL3e7C8x0gLro7PHsq1H7uLywuS5VKx+JCX3X5XJYbudwqlxoVJpc7zaM7rS93Wnfv9D0i73ZXmI4C4332L/Stt+bb1xVuo17Btt+91TmAdJpeVdjOR/c6NxKXO87zNDkYxliSDCUY3vsX4oaK+cKOMErc93X5C4mUkbiIx97v8i0tTwwoFZF7bwWIVUauOVHuk4gM0I59u5Xhu416BbjjaPowyLYcYTrqNzLtcEs2L/qw3lzTpIbJ+bUvvWmkP3aR7wg/bEAtcW3cz9Zc2rffbJ64TCJrTGOKxdiMMdEtg7xRklii9brr8nOGb9L/OtjoBqFHH6AmZ0PQ/dH6kos4zJHdB2A0/ljj5+y2js8mi6A8HjppjrO8QQGI/vg9xXE657/6gMmUvs2HOvbUZx/JhBzJk40+0QZiZSZPNufUDbgPMnnY9Ce8XUpf489NVhv/6UCdEsqXzYeHlJNC2WV8/YYPFPZchpXRS6UM1F26v6WrGyfa8xIsVXcPUNeiKVKRTMU9IRJyMlyprDK0ZAB1fq+WoR0rq9ozeAhTG+gPOmgEtAu4iiYECfxla1XTiiiDHKW69xxEAi6WUUAFObHZC3eXwcQycBfu7oIIRqRaMojun8Ak2kA8kIxCsSBugGEWUkFUL0jFknsXhWBEFpfdpTCTQKxcEoV7erEZnfGFepEr3fIKEzpBhkIwIEhBpdFoNBqNK/gH2kAk3HwBy34AAAAASUVORK5CYII="
        />
        <svg
          class="w-4 h-4 mx-1.5"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
      <div
        id="dropdownHover"
        class="z-10 hidden bg-white divide-y divide-white rounded-lg shadow w-44 dark:bg-white"
      >
        <ul
          class="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          <li>
            <a
              href="#"
              class="text-black block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <Link to="/profile"> Profile</Link>
              {/*consits of Link generated to route*/}
            </a>
          </li>
          <li>
            <a
              href="#"
              class="text-black block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <Link to="/settings"> Settings</Link>
            </a>
          </li>
          <li>
            <a
              href="#"
              class="text-black block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <Link to="/logout">Log-out</Link>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
