import { Link } from "react-router-dom";
import monkey from "../../images/the_monkeys.svg";
import { motion } from "framer-motion"
export const Logo = () => {
  return (
    <div data-testid="logo">
      <Link className="logo text-lightBlack flex items-center justify-center pt-2 md:w-40 w-24" to="/">
        <motion.img whileTap={{ scale: 0.75 }} draggable="false" className="" src={monkey} alt="The Monkeys" />
      </Link>
    </div>
  );
};