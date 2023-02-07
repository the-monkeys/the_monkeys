import { NavLink } from "react-router-dom";
export const SignupBtn = () => {
    return(
    <div className="hidden md:flex justify-between items-center space-x-6">
        <NavLink
            to="/login"
            className="py-2 px-6 bg-transparent baseline 
            cursor-pointer border-2 border-transparent main-link hover:text-black "
        >
            Login
        </NavLink>
        <NavLink
            className="py-2 px-6 text-white  bg-lightBlack baseline
            cursor-pointer rounded-sm hover:bg-transparent hover:text-lightBlack
            border-2 hover: border-lightBlack"
            to="/register"
        >
            Sign Up
        </NavLink>
    </div>
    )
}