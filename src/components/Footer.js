import { Link } from "react-router-dom";
import Logo from "./Logo";
import instIcon from "../images/icon.insta.svg";
import TwitterIcon from "../images/icon-twitter.svg";
export default function Footer() {
  return (
    <footer className="absolute bottom-0 w-full bg-offWhite">
      {/* Absolute property is temporary */}
      <div
        className="container flex flex-col-reverse justify-between 
      px-6 py-5 md:py-10 mx-auto space-y-8 md:flex-row md:space-y-0 "
      >
        {/* Logo and Social Links*/}
        <div
          className="flex flex-col items-center justify-around space-y-5
         md:items-start mt-8 md:mt-0"
        >
          <Logo />
          <div className="text-sm mx-auto my-6 text-center text-white md:hidden">
            &copy; 2023, The Monkeys'
          </div>
        </div>
        {/* Other Links */}
        <div className="flex justify-around space-x-18 md:space-x-32">
          <div className="links flex flex-col space-y-3 text-white">
            <Link to="/" className="hover:text-gray">
              Blog
            </Link>
            <Link to="/" className="hover:text-gray">
              About
            </Link>
            <Link to="/" className="hover:text-gray">
              Explore
            </Link>
            <Link to="/" className="hover:text-gray">
              Publishers
            </Link>
          </div>
          <div className="links flex flex-col space-y-3 text-white">
            <Link to="/" className="hover:text-gray">
              Developers
            </Link>
            <Link to="/" className="hover:text-gray">
              Terms of service
            </Link>
            <Link to="/" className="hover:text-gray">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-gray">
              Support
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <form>
            <div className="flex space-x-3">
              <input
                type="text"
                className="border-solid border-2 border-lightBlack flex-1 px-4 rounded"
                placeholder="Get Updates"
              />
              <button className="px-6 py-1 rounded text-offWhite bg-lightBlack hover:bg-transparent hover:text-lightBlack focus:outline-none hover:border-solid border-2 border-lightBlack">
                Go
              </button>
            </div>
          </form>
          <div className="w-full flex items-center space-x-4">
            <div>Let's be friends</div>
            <a
              href="https://www.instagram.com/_the__monkeys_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={instIcon} alt="Insta-logo"></img>
            </a>
            <a className="mb-0.5"
              href="https://twitter.com/DaVeTwEeTlive"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={TwitterIcon} alt="Twitter-logo"></img>
            </a>
          </div>
          <div className="hidden text-lightBlack md:block">
            &copy; 2023, The Monkeys'
          </div>
        </div>
      </div>
    </footer>
  );
}