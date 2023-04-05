import { Link } from "react-router-dom";
import monkey from "../../images/logo-1.jpg";

export const Logo = () => {
  return (
    <div data-testid="logo">
      <Link className="logo text-lightBlack flex items-center pt-2 w-40" to="/">
        <img className="" src={monkey} alt="The Monkeys" />
      </Link>
    </div>
  );
};
