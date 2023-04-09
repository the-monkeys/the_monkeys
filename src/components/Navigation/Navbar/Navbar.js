import { Link } from "react-router-dom";
import { useMemo } from "react";

export const Navbar = () => {
  const navLinks = useMemo(() => {
    return [
      {
        name: "Trending",
        link: "/",
        key: 1,
      },
      {
        name: "Technology",
        link: "/",
        key: 2,
      },
      {
        name: "Lifestyle",
        link: "/",
        key: 3,
      },
      {
        name: "Health",
        link: "/",
        key: 4,
      },
      {
        name: "Business & Finance",
        link: "/",
        key: 5,
      },
      {
        name: "Philosophy & Psychology",
        link: "/",
        key: 6,
      },
      {
        name: "Login",
        link: "/login",
        key: 7,
      },
      {
        name: "Register",
        link: "/register",
        key: 8,
      },
    ];
  }, []);

  return (
    <div>
      <ul
        className="mobile-nav absolute flex flex-col items-center self-end py-8 space-y-6 
        bg-white sm:self-center w-full shadow-md"
      >
        {navLinks.map((links) => {
          return (
            <Link to={links.link} key={links.key}>
              {links.name}
            </Link>
          );
        })}
      </ul>
    </div>
  );
};
