import instIcon from "../../images/icon.insta.svg";
import TwitterIcon from "../../images/icon-twitter.svg";
import Illustration from "../../images/illustration-home.svg";
import { useEffect } from "react";
import { useState } from "react";

export const Home = () => {
 
  const [theme, setTheme] = useState()

 useEffect(()=>{
    const localTheme = localStorage.getItem("theme");
    document.querySelector('html').setAttribute('data-theme', localTheme);
    setTheme(localTheme)
 },[]);

  return (
    <div className={`py-24 md:py-44 h-screen ${theme == "light" ? "bg-white" : "bg-[#39393a]"}`} data-testid="home">
      <div className="text-xl container w-[85%] mx-auto flex-col-reverse md:flex-row flex items-center justify-between">
        <div className="slideLeft w-full md:w-1/2 flex-col items-center space-y-4 text-center md:text-left">
          <h2>We are Coming Soon!</h2>
          <p>
            Our Website is under construction, feel free to explore!
            <br />
            Follow us and be the first to know when we go live!
          </p>
          <div className="flex w-full items-center justify-center md:justify-start space-x-4">
            <a
              href="https://www.instagram.com/_the__monkeys_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img draggable="false" src={instIcon} className="w-14" alt="Insta-logo"></img>
            </a>
            <a
              href="https://twitter.com/themonkeyslife"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img draggable="false" src={TwitterIcon} className="w-12" alt="Twitter-logo"></img>
            </a>
          </div>
        </div>
        <div className="w-1/2 mb-4 md:mb-0 md:w-1/3">
          <img draggable="false" src={Illustration} className="slide" alt="img" />
        </div>
      </div>
    </div>
  );
};
