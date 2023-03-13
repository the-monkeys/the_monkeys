import { Link } from "react-router-dom"
export const Dropdown = ({ isLoggedIn }) => {
    return(
        <div>
        <ul
          className="mobile-nav absolute flex flex-col items-center self-end py-8 space-y-6 
        bg-white sm:self-center w-full shadow-md"
        >
        <Link to="/">
            Trending
          </Link>
          <Link to="/">
            Technology
          </Link>
          <Link to="/">
            Lifestyle
          </Link>
          <Link to="/">
            Health
          </Link>
          <Link to="/">
            Business & Finance
          </Link>
          <Link to="/">
            Philosophy & psychology
          </Link>
          {isLoggedIn ? '' : <><Link to="/login">
            Login
          </Link>
          <Link to="/register">
            Register
          </Link></>}
        </ul>
      </div>
    )
}