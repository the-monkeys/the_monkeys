import Logo from "@/components/basic/Logo";
import ThemeSwitch from "@/components/basic/ThemeSwitch";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-monkeyWhite dark:bg-primary-monkeyBlack p-4">
      <Logo />
      <h1 className="font-josefin_Sans text-3xl md:text-4xl dark:text-secondary-white font-extrabold mb-4 text-center">
        We are Coming Soon!
      </h1>
      <p className="font-jost text-base md:text-lg dark:text-secondary-white text-gray-600 mb-4 text-center">
        Our Website is under construction, feel free to explore!
      </p>
      <p className="font-jost text-base md:text-lg dark:text-secondary-white text-gray-700 mb-4 text-center">
        Follow us and be the first to know when we go live!
      </p>
      <h2 className="font-josefin_Sans text-lg md:text-xl dark:text-secondary-white font-extrabold mb-4 text-center">
        Switch Themes Here!
      </h2>
      <ThemeSwitch />
    </div>
  );
};

export default Home;
