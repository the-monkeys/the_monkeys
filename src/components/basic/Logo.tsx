"use-client";
import Image from "next/image";

const Logo = () => {
  return (
    <>
      <Image
        src={"/monkeysOrange.png"}
        alt="Monkeys Logo"
        title="Monkeys Logo"
        height={30}
        width={119}
        className="dark:hidden"
      />
      <Image
        src={"/monkeysWhite.png"}
        alt="Monkeys Logo"
        title="Monkeys Logo"
        height={30}
        width={119}
        className="dark:block hidden"
      />
    </>
  );
};

export default Logo;
