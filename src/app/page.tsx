import ThemeSwitch from "@/components/basic/ThemeSwitch";

const Home = () => {
  return (
    <div className="flex flex-col dark:bg-primary-monkeyBlack items-center justify-center h-screen bg-primary-monkeyWhite">
      <h1 className="font-josefin_Sans text-4xl dark:text-secondary-white   font-extrabold  mb-4">
        We are Coming Soon!
      </h1>
      <p className="font-jost text-lg dark:text-secondary-white text-gray-600 mb-4">
        Our Website is under construction, feel free to explore!
      </p>
      <p className="font-jost  dark:text-secondary-white text-gray-700 mb-4">
        Follow us and be the first to know when we go live!
      </p>
      <h2 className="font-josefin_Sans text-xl dark:text-secondary-white   font-extrabold  mb-4">
        Switch Themes Here!
      </h2>
      <ThemeSwitch />
    </div>
  );
};

export default Home;
