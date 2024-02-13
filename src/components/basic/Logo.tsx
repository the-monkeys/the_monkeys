// ./src/components/basic/Logo.tsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LogoProps {
  showMobileLogo?: boolean;
}

const Logo: React.FC<LogoProps> = ({ showMobileLogo = false }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set your desired breakpoint
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {showMobileLogo && isMobile ? (
        <>
          <Image
            src={"/mobilelogo.png"} // Specify the path to your mobile logo
            alt="Mobile Logo"
            title="Mobile Logo"
            height={10}
            width={30} // Adjust the width according to your mobile logo dimensions
			className="dark:hidden"
          />
          <Image
            src={"/mobilelogolight.png"} // Specify the path to your mobile logo
            alt="Mobile Logo"
            title="Mobile Logo"
            height={10}
            width={30} // Adjust the width according to your mobile logo dimensions
			className="dark:block hidden"
          />
        </>
      ) : (
        <>
			<Image
				src={"/monkeysTitleDark.png"}
				alt="Monkeys Logo"
				title="The Monkeys"
				height={30}
				width={119}
				className="dark:hidden"
			/>
			<Image
				src={"/monkeysTitleLight.png"}
				alt="Monkeys Logo"
				title="The Monkeys"
				height={30}
				width={119}
				className="dark:block hidden"
			/>
        </>
      )}
    </>
  );
};

export default Logo;
