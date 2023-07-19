import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import instIcon from "../../images/icon.insta.svg";
import TwitterIcon from "../../images/icon-twitter.svg";

// With Left Aligned Newsletter {about, career}

export const Footer = () => {
  return (
    <footer className="w-full bg-[#F2F1EE]" data-testid="footer">
      {/* Absolute property is temporary */}
      <div
        className="container flex flex-col-reverse justify-between 
      px-6 py-5 md:py-10 mx-auto space-y-8 md:flex-row md:space-y-0"
      >
        {/* Logo and Social Links*/}
        <div
          className="flex flex-col items-center justify-around space-y-5
         md:items-start mt-8 md:mt-0 "
        >
          <Logo />
          <div className="text-sm mx-auto my-6 text-center md:hidden">
            &copy; 2023, The Monkeys'
          </div>
        </div>
        {/* Other Links */}
        <div className="flex justify-around space-x-18 md:space-x-32">
          <div className="links flex flex-col space-y-3 text-[#333030]">
            <Link to="/" className="text-gray">
              Blog
            </Link>
            <Link to="/" className="main-link">
              About
            </Link>
            <Link to="/" className="main-link">
              Explore
            </Link>
            <Link to="/" className="main-link">
              Publishers
            </Link>
          </div>
          <div className="links flex flex-col space-y-3 text-[#333030]">
            <Link to="/tos" className="main-link">
              Terms of service
            </Link>
            <Link to="/" className="main-link">
              Privacy Policy
            </Link>
            <Link to="/" className="main-link">
              Support
            </Link>
            <Link to="/meet-the-monkeys" className="main-link">
              Meet the Monkeys
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <form>
            <div className="flex space-x-3">
              <input
                type="text"
                className="border-solid border-[1.5px] border-lightBlack flex-1 px-4 rounded active-lightBlack outline-none"
                placeholder="Get Updates"
              />
              <button className="px-6 py-1 rounded-sm text-offWhite bg-lightBlack hover:bg-transparent hover:text-lightBlack focus:outline-none hover:border-solid border-2 border-lightBlack">
                Go
              </button>
            </div>
          </form>
          <div className="hidden md:flex w-full items-center space-x-4 text-gray-700">
            <p>Social Media</p>
            <a
              href="https://www.instagram.com/_the__monkeys_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={instIcon} alt="Insta-logo"></img>
            </a>
            <a
              href="https://twitter.com/themonkeyslife?s=11&t=DhJUJw7KSAV1RJND90bHUg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={TwitterIcon} alt="Twitter-logo"></img>
            </a>
          </div>
          <div className="hidden md:block">&copy; 2023, The Monkeys'</div>
        </div>
      </div>
    </footer>
  );
};
